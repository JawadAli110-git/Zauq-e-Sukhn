const { getDB } = require('../config/db');

const toPoet = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    nameUrdu: row.name_urdu,
    bio: row.bio,
    bioUrdu: row.bio_urdu,
    era: row.era,
    eraUrdu: row.era_urdu,
    style: row.style,
    styleUrdu: row.style_urdu,
    imageUrl: row.image_url,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
  };
};

const Poet = {
  findAll() {
    return getDB()
      .prepare('SELECT * FROM poets WHERE is_active = 1 ORDER BY name ASC')
      .all()
      .map(toPoet);
  },

  findById(id) {
    const row = getDB().prepare('SELECT * FROM poets WHERE id = ?').get(id);
    return toPoet(row);
  },

  findByName(name) {
    if (!name) return null;
    const row = getDB().prepare('SELECT * FROM poets WHERE name = ? OR name_urdu = ? LIMIT 1').get(name, name);
    return toPoet(row);
  },

  create(data) {
    const info = getDB()
      .prepare(`INSERT INTO poets
        (name, name_urdu, bio, bio_urdu, era, era_urdu, style, style_urdu, image_url, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(
        data.name, data.nameUrdu,
        data.bio || null, data.bioUrdu || null,
        data.era || null, data.eraUrdu || null,
        data.style || null, data.styleUrdu || null,
        data.imageUrl || '', 1
      );
    return this.findById(info.lastInsertRowid);
  },

  update(id, data) {
    const fields = [];
    const values = [];
    const map = {
      name: 'name', nameUrdu: 'name_urdu', bio: 'bio', bioUrdu: 'bio_urdu',
      era: 'era', eraUrdu: 'era_urdu', style: 'style', styleUrdu: 'style_urdu',
      imageUrl: 'image_url', isActive: 'is_active',
    };
    for (const [key, col] of Object.entries(map)) {
      if (key in data) {
        fields.push(`${col} = ?`);
        values.push(key === 'isActive' ? (data[key] ? 1 : 0) : data[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    values.push(id);
    getDB().prepare(`UPDATE poets SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  },

  softDelete(id) {
    getDB().prepare('UPDATE poets SET is_active = 0 WHERE id = ?').run(id);
    return this.findById(id);
  },
};

module.exports = Poet;
