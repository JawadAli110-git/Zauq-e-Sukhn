const { getDB } = require('../config/db');

const toQafiya = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    word: row.word,
    wordUrdu: row.word_urdu,
    meaning: row.meaning,
    meaningUrdu: row.meaning_urdu,
    endingSound: row.ending_sound,
    examples: JSON.parse(row.examples || '[]'),
    relatedWords: JSON.parse(row.related_words || '[]'),
    createdAt: row.created_at,
  };
};

const Qafiya = {
  findAll(search) {
    if (search) {
      const like = `%${search}%`;
      return getDB()
        .prepare(`SELECT * FROM qafiya
          WHERE word LIKE ? OR word_urdu LIKE ? OR ending_sound LIKE ?
          ORDER BY word ASC`)
        .all(like, like, like)
        .map(toQafiya);
    }
    return getDB().prepare('SELECT * FROM qafiya ORDER BY word ASC').all().map(toQafiya);
  },

  search(query) {
    const like = `%${query}%`;
    return getDB()
      .prepare(`SELECT * FROM qafiya
        WHERE word LIKE ? OR word_urdu LIKE ? OR ending_sound LIKE ? OR related_words LIKE ?`)
      .all(like, like, like, like)
      .map(toQafiya);
  },

  findById(id) {
    const row = getDB().prepare('SELECT * FROM qafiya WHERE id = ?').get(id);
    return toQafiya(row);
  },

  create(data) {
    const info = getDB()
      .prepare(`INSERT INTO qafiya
        (word, word_urdu, meaning, meaning_urdu, ending_sound, examples, related_words)
        VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(
        data.word, data.wordUrdu,
        data.meaning || null, data.meaningUrdu || null,
        data.endingSound || null,
        JSON.stringify(data.examples || []),
        JSON.stringify(data.relatedWords || [])
      );
    return this.findById(info.lastInsertRowid);
  },

  update(id, data) {
    const fields = [];
    const values = [];
    if ('word' in data)         { fields.push('word = ?');          values.push(data.word); }
    if ('wordUrdu' in data)     { fields.push('word_urdu = ?');     values.push(data.wordUrdu); }
    if ('meaning' in data)      { fields.push('meaning = ?');       values.push(data.meaning); }
    if ('meaningUrdu' in data)  { fields.push('meaning_urdu = ?'); values.push(data.meaningUrdu); }
    if ('endingSound' in data)  { fields.push('ending_sound = ?'); values.push(data.endingSound); }
    if ('examples' in data)     { fields.push('examples = ?');      values.push(JSON.stringify(data.examples)); }
    if ('relatedWords' in data) { fields.push('related_words = ?'); values.push(JSON.stringify(data.relatedWords)); }
    if (!fields.length) return this.findById(id);
    values.push(id);
    getDB().prepare(`UPDATE qafiya SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  },

  delete(id) {
    const entry = this.findById(id);
    getDB().prepare('DELETE FROM qafiya WHERE id = ?').run(id);
    return entry;
  },
};

module.exports = Qafiya;
