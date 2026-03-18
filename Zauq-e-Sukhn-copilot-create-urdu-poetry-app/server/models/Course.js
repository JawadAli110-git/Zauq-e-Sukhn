const { getDB } = require('../config/db');

const toCourse = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    titleUrdu: row.title_urdu,
    description: row.description,
    descriptionUrdu: row.description_urdu,
    order: row.order_num,
    lessons: JSON.parse(row.lessons || '[]'),
    isPublished: row.is_published === 1,
    createdAt: row.created_at,
  };
};

const Course = {
  findAll() {
    return getDB()
      .prepare('SELECT * FROM courses WHERE is_published = 1 ORDER BY order_num ASC')
      .all()
      .map(toCourse);
  },

  findById(id) {
    const row = getDB().prepare('SELECT * FROM courses WHERE id = ?').get(id);
    return toCourse(row);
  },

  create(data) {
    const info = getDB()
      .prepare(`INSERT INTO courses
        (title, title_urdu, description, description_urdu, order_num, lessons, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(
        data.title, data.titleUrdu,
        data.description || null, data.descriptionUrdu || null,
        data.order || 0,
        JSON.stringify(data.lessons || []),
        data.isPublished !== false ? 1 : 0
      );
    return this.findById(info.lastInsertRowid);
  },

  update(id, data) {
    const fields = [];
    const values = [];
    if ('title' in data)            { fields.push('title = ?');            values.push(data.title); }
    if ('titleUrdu' in data)        { fields.push('title_urdu = ?');       values.push(data.titleUrdu); }
    if ('description' in data)      { fields.push('description = ?');      values.push(data.description); }
    if ('descriptionUrdu' in data)  { fields.push('description_urdu = ?'); values.push(data.descriptionUrdu); }
    if ('order' in data)            { fields.push('order_num = ?');        values.push(data.order); }
    if ('lessons' in data)          { fields.push('lessons = ?');          values.push(JSON.stringify(data.lessons)); }
    if ('isPublished' in data)      { fields.push('is_published = ?');     values.push(data.isPublished ? 1 : 0); }
    if (!fields.length) return this.findById(id);
    values.push(id);
    getDB().prepare(`UPDATE courses SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  },

  delete(id) {
    const course = this.findById(id);
    getDB().prepare('DELETE FROM courses WHERE id = ?').run(id);
    return course;
  },
};

module.exports = Course;
