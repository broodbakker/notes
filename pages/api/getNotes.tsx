import { NextApiRequest, NextApiResponse } from 'next'
import faunadb from "faunadb"

const secret: string = (process.env.FAUNA_SECRET_KEY as string);

const q = faunadb.query;

const client = new faunadb.Client({ secret, domain: "db.eu.fauna.com" })

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const dbs: any = await client.query(
      q.Map(
        // iterate each item in result
        q.Paginate(
          // make paginatable
          q.Match(
            // query index
            q.Index("all_notes") // specify source
          )
        ),
        (ref) => q.Get(ref) // lookup each result by its reference
      )
    );


    res.status(200).json(dbs.data);
  } catch (e) {
    // something went wrong
    res.status(500).json({ error: e });
  }
};