const { Router } = require('express')
const Company = require('./model')

const router = new Router()

// get all companies
// router.get('/companies', (req, res, next) => {
//   Company
//     .findAll()
//     .then(companies => {
//       res.send({ companies })
//     })
//     .catch(error => next(error))
// })

//last exercise- rewrite to paginated the companies
router.get('/companies', (req, res, next) => {
    const limit = req.query.limit || 20
    const offset = req.query.offset || 0
  
    Promise.all([
      Company.count(),
      Company.findAll({ limit, offset })
    ])
      .then(([total, companies]) => {
        res.send({
          companies, total
        })
      })
      .catch(error => next(error))
  })

// get 1 company with id
router.get('/companies/:id', (req, res, next) => {
  Company
    .findById(req.params.id)
    .then(company => {
      if (!company) {
        return res.status(404).send({
          message: `Company does not exist`
        })
      }
      return res.send(company)
    })
    .catch(error => next(error))
})

// create new company
router.post('/companies', (req, res, next) => {
  Company
    .create(req.body)
    .then(company => {
      if (!company) {
        return res.status(404).send({
          message: `Company does not exist`
        })
      }
      return res.status(201).send(company)
    })
    .catch(error => next(error))
})

// change a company
router.put('/companies/:id', (req, res, next) => {
  Company
    .findById(req.params.id)
    .then(company => {
      if (!company) {
        return res.status(404).send({
          message: `Company does not exist`
        })
      }
      return company.update(req.body).then(company => res.send(company))
    })
    .catch(error => next(error))
})

// delete a company
router.delete('/companies/:id', (req, res, next) => {
  Company
    .findById(req.params.id)
    .then(company => {
      if (!company) {
        return res.status(404).send({
          message: `Company does not exist`
        })
      }
      return company.destroy()
        .then(() => res.send({
          message: `Company was deleted`
        }))
    })
    .catch(error => next(error))
})

module.exports = router