import { sql } from "@vercel/postgres";

export type Background = {
  image: string;
  new_background: string | null;
  review: string;
  review_completed: boolean;
  theme: string | null;
};

export async function addBackground(image: string): Promise<void> {
  await sql`INSERT INTO backgrounds (image) VALUES (${image})`;
  const result =
    await sql`SELECT currval(pg_get_serial_sequence('backgrounds', 'id'))`;
  return result.rows[0].currval;
}

export async function setNewBackground(
  id: number,
  newBackground: string
): Promise<void> {
  await sql`UPDATE backgrounds SET new_background=${newBackground} WHERE id=${id}`;
}

export async function setReview(id: number, review: string): Promise<void> {
  console.log("setting review", id, review);
  await sql`UPDATE backgrounds SET review=${review} WHERE id=${id}`;
}

export async function setReviewCompleted(
  id: number,
  reviewCompleted: boolean
): Promise<void> {
  await sql`UPDATE backgrounds SET review_completed=${reviewCompleted} WHERE id=${id}`;
}

export async function setTheme(id: number, theme: string): Promise<void> {
  await sql`UPDATE backgrounds SET theme=${theme} WHERE id=${id}`;
}

export async function getBackground(id: number): Promise<Background | null> {
  const result = await sql`SELECT * FROM backgrounds WHERE id=${id}`;
  return result.rows[0] as Background | null;
}
