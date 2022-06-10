import faunadb from "faunadb"
import { NextApiRequest, NextApiResponse } from 'next'
//typescript
import { INoteData } from "../../typescript"

const secret: string = (process.env.FAUNA_SECRET_KEY as string);

const q = faunadb.query;
const client = new faunadb.Client({ secret, domain: "db.eu.fauna.com" })

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {

  const request = async (noteData: INoteData) => {
    const data = {
      title: noteData.title,
      content: noteData.content
    }

    try {
      const dbs = await client.query(
        q.Create(
          // iterate each item in result
          q.Collection("notes"),
          {
            data
          }
        )
      );
      return dbs

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  const notesData = JSON.parse(req.body)

  var results = await Promise.all(
    notesData.map(async (noteData: INoteData) => {
      const response = await request(noteData)
      return response
    })).then((values) => res.status(200).json(values)).catch((e) => {
      // dispatch a failure and throw error
      res.status(500).json({ error: e.message })
    })

}