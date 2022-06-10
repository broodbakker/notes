import faunadb from "faunadb"
import { NextApiRequest, NextApiResponse } from 'next'
// your secret hash

const secret: string = (process.env.FAUNA_SECRET_KEY as string);
const q = faunadb.query;
const client = new faunadb.Client({ secret, domain: "db.eu.fauna.com" })

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {
  const formData = JSON.parse(req.body)

  const data = {
    title: formData.title,
    content: formData.content
  }
  try {
    const dbs: any = await client.query(
      q.Create(
        // iterate each item in result
        q.Collection("notes"),
        {
          data
        }
      )
    );
    // ok
    res.status(200).json(dbs.data);

  } catch (e: any) {
    // something went wrong
    res.status(500).json({ error: e.message });
  }
};