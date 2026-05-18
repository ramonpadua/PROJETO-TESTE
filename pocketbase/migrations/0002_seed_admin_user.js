migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // Idempotent: skip if user already exists
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'ramon.padua@adapta.org')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('ramon.padua@adapta.org')
    record.setPassword('12345678')
    record.setVerified(true)
    record.set('name', 'Admin')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'ramon.padua@adapta.org')
      app.delete(record)
    } catch (_) {}
  },
)
