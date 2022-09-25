import { GraphQLClient, gql } from 'graphql-request';

const graphqlAPI = process.env.HYGRAPH_ENDPOINT;
const graphqlToken = process.env.HYGRAPH_TOKEN;

export default async function handler(req, res) {
  const graphQLClient = new GraphQLClient(graphqlAPI, {
    headers: {
      authorization: `Bearer ${graphqlToken}`,
    }
  });

  const query = gql`
    mutation CreateWordList($userName: String!, $quizName: String!, $slug: String!, $words: String!) {
      createWordList(data: {userName: $userName, quizName: $quizName, slug: $slug, words: $words }) { id }
      publishWordList(where: {slug: $slug}) { id }
    }
      `
      // const query = gql`
      // mutation CreateWordList {
      //   createWordList(data: { userName: 'rjames', quizName: 'quiz', words: 'quiz', slug: 'rjames-quiz' }) { id }
      //   publishWordList(where: {slug: 'rjames-quiz'}) { id }
      // }
      //   `

    try{
      console.log('setWords.js')
      console.log(req.body)
      const result = await graphQLClient.request(query, req.body);
      res.status(200).send(result);
    } catch (error) {
      console.log('error 500: ' + error);
      res.status(500).send(error);
    }
}