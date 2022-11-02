import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'

import React from 'react'

import { gql, GraphQLClient } from 'graphql-request';
import { useSpeechSynthesis } from 'react-speech-kit';


export const getStaticProps = async (context) => {
    const hygraph = new GraphQLClient(process.env.HYGRAPH_ENDPOINT)

    const { wordLists } = await hygraph.request(`
    {
        wordLists (where: {slug: "${context.params.slug}"}) {
            id
            slug
            userName
            words
          }
    }`)

    return {
        props: {
            wordLists
        }
    }
}

export const getStaticPaths = async () => {
    const hygraph = new GraphQLClient(process.env.HYGRAPH_ENDPOINT)

    const { wordLists } = await hygraph.request(`
        {
            wordLists {
                slug
            }
        }
    `)

    const paths = wordLists.map(item => ({
        params: {
            slug: item.slug,
        }
    }));

    return {
        paths,
        fallback: 'blocking',
    };
}

export default function Quiz({ wordLists }) {

  const wordArray = wordLists[0].words.split(';');
  for(let i = 0; i < wordArray.length; i++) {
    wordArray[i] = wordArray[i].trim();
    if(wordArray[i].length === 0) {
        wordArray.splice(i, 1);
        i--;
    }
  }

  for(let j = wordArray.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    [wordArray[j], wordArray[k]] = [wordArray[k], wordArray[j]];
  }
  const [word, setWord] = React.useState(wordArray[0]);
  const { speak } = useSpeechSynthesis();
  const [index, setIndex] = React.useState(0);
  const [guessedWord, setGuessedWord] = React.useState('');
  const [score, setScore] = React.useState(0);

  const [pitch, setPitch] = React.useState(1);
  const [rate, setRate] = React.useState(1);

  console.log(wordArray);


  return (
    <div className={styles.container}>
      <Head>
        <title>Spelling with CDS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Time to <span className="text-blue-600">Spell!</span>
        </h1>

        <div className={"grid-cols-1 text-center pt-6"}>
          {/* <code>{wordLists[0].words}</code> */}
          <div className="p-2">
            <button onClick={() => {
                // setWord(wordArray[index]);
                    speak({ text: word, rate, pitch });

                }}
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
                >
                    Speak
            </button>
          </div>
          <div>
            <textarea
              rows="1"
              className="flex-auto lg:p-6 text-center border-2 w-.5 h-8 resize-none text-3xl"
              value={guessedWord}
              onChange={(e) => {
                if (e.nativeEvent.inputType === "insertLineBreak") return;
                setGuessedWord(e.target.value)
              }}
            ></textarea>
          </div>
          <div>
            <button
              className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
              onClick={() => {
                console.log(index)
                if (guessedWord.trim() == word.trim()) {
                  setScore(score + 10);
                  alert("Correct!\n\nYour score is: " + (score+10));
                  const newIndex = index + 1 <= wordArray.length - 1 ? index + 1 : 0;
                  setIndex(newIndex);
                  setWord(wordArray[newIndex]);
                } else {
                  alert("Incorrect!\n\nYour score is: " + score);
                }
                console.log(index)
              }}
            >
              Check Answer
            </button>
          </div>


          <div>
              <div>
                <label htmlFor="rate">Rate: </label>
                <div>{rate}</div>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                defaultValue="1"
                step="0.1"
                id="rate"
                onChange={(event) => {
                  setRate(event.target.value);
                }}
              />
            </div>
            <div>
              <div>
                <label htmlFor="pitch">Pitch: </label>
                <div className="pitch-value">{pitch}</div>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                defaultValue="1"
                step="0.1"
                id="pitch"
                onChange={(event) => {
                  setPitch(event.target.value);
                }}
              />
            </div>
          
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://ryan-james.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by Ryan James
        </a>
      </footer>
    </div>
  )
}
