const { getDB } = require('../config/db');
const Poet = require('./Poet');

const toPoem = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    titleUrdu: row.title_urdu,
    type: row.type,
    poet: row.poet_id,
    content: row.content,
    contentLines: JSON.parse(row.content_lines || '[]'),
    language: row.language,
    tags: JSON.parse(row.tags || '[]'),
    isFeatured: row.is_featured === 1,
    viewCount: row.view_count,
    createdAt: row.created_at,
  };
};

// Attach poet sub-object (name + nameUrdu) if requested
const withPoet = (poem) => {
  if (!poem) return null;
  const poet = Poet.findById(poem.poet);
  return { ...poem, poet: poet ? { _id: poet._id, name: poet.name, nameUrdu: poet.nameUrdu } : null };
};

const Poetry = {
  find({ type, poetId, featured, limit } = {}) {
    let sql = 'SELECT * FROM poetry WHERE 1=1';
    const params = [];
    if (type)     { sql += ' AND type = ?';        params.push(type); }
    if (poetId)   { sql += ' AND poet_id = ?';     params.push(poetId); }
    if (featured) { sql += ' AND is_featured = 1'; }
    sql += ' ORDER BY created_at DESC';
    if (limit)    { sql += ' LIMIT ?';             params.push(limit); }
    return getDB().prepare(sql).all(...params).map(toPoem).map(withPoet);
  },

  findById(id) {
    const row = getDB().prepare('SELECT * FROM poetry WHERE id = ?').get(id);
    return withPoet(toPoem(row));
  },

  findByPoet(poetId) {
    return getDB()
      .prepare('SELECT * FROM poetry WHERE poet_id = ? ORDER BY created_at DESC')
      .all(poetId)
      .map(toPoem)
      .map(withPoet);
  },

  create(data) {
    // Resolve poet ID from name if not provided directly
    let poetId = data.poet || data.poetId || null;
    if (!poetId && data.poetName) {
      const found = Poet.findByName(data.poetName);
      if (found) poetId = found.id;
    }
    // Derive content from contentLines if not provided
    const lines = (data.contentLines || []).filter(l => l && l.trim());
    const content = data.content || lines.join('\n') || null;

    const info = getDB()
      .prepare(`INSERT INTO poetry
        (title, title_urdu, type, poet_id, content, content_lines, language, tags, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(
        data.title || null, data.titleUrdu || null,
        data.type || null, poetId,
        content,
        JSON.stringify(lines),
        data.language || 'urdu',
        JSON.stringify(data.tags || []),
        data.isFeatured ? 1 : 0
      );
    return this.findById(info.lastInsertRowid);
  },

  update(id, data) {
    const fields = [];
    const values = [];
    const map = {
      title: 'title', titleUrdu: 'title_urdu', type: 'type',
      content: 'content', language: 'language', isFeatured: 'is_featured',
    };
    for (const [key, col] of Object.entries(map)) {
      if (key in data) {
        fields.push(`${col} = ?`);
        values.push(key === 'isFeatured' ? (data[key] ? 1 : 0) : data[key]);
      }
    }
    if ('contentLines' in data) {
      const lines = (data.contentLines || []).filter(l => l && l.trim());
      fields.push('content_lines = ?'); values.push(JSON.stringify(lines));
      // also update content text
      fields.push('content = ?'); values.push(lines.join('\n'));
    }
    if ('tags' in data)         { fields.push('tags = ?');          values.push(JSON.stringify(data.tags)); }
    if ('poet' in data || 'poetId' in data || 'poetName' in data) {
      let poetId = data.poet || data.poetId || null;
      // If poet is an object (from withPoet), extract _id
      if (poetId && typeof poetId === 'object') poetId = poetId._id || poetId.id;
      if (!poetId && data.poetName) {
        const found = Poet.findByName(data.poetName);
        if (found) poetId = found.id;
      }
      fields.push('poet_id = ?'); values.push(poetId);
    }
    if (!fields.length) return this.findById(id);
    values.push(id);
    getDB().prepare(`UPDATE poetry SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  },

  incrementView(id) {
    getDB().prepare('UPDATE poetry SET view_count = view_count + 1 WHERE id = ?').run(id);
    return this.findById(id);
  },

  delete(id) {
    const poem = this.findById(id);
    getDB().prepare('DELETE FROM poetry WHERE id = ?').run(id);
    return poem;
  },
};

module.exports = Poetry;
