migrate(
  (app) => {
    const collection = new Collection({
      name: 'lottery_results',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'data_consulta', type: 'date', required: true },
        { name: 'resultados', type: 'json', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('lottery_results')
    app.delete(collection)
  },
)
