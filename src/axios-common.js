import axios from 'axios'

export const HTTP = axios.create({
  baseURL: 'https://www.jouer-club.cl/',
  headers: {
    Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAzMmJmZTA1Y2Y0MWQ5MWU1NDA5YzllZWU3ZjNkNzI3NDExYTM0ODI3N2I1M2I2YjBiMTgwYWZhYjJmNzFjZTBlNzE1YzYxYmE1ZWVmYzlkIn0.eyJhdWQiOiIyIiwianRpIjoiMDMyYmZlMDVjZjQxZDkxZTU0MDljOWVlZTdmM2Q3Mjc0MTFhMzQ4Mjc3YjUzYjZiMGIxODBhZmFiMmY3MWNlMGU3MTVjNjFiYTVlZWZjOWQiLCJpYXQiOjE1MzEyMDE5MDgsIm5iZiI6MTUzMTIwMTkwOCwiZXhwIjoxNTMzNzkzOTA4LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.SgpNI8IYShI65n4KUUIRMKWsZCQdLTzxUJ55If6qbna25-G04wue7rLAzfB-MmYL1K7FYCxosfSRaHB77mAOjjdj1aLLA4--z6OPGBVWbJ6T4-Ivn6EZxDWXKyvXWhcpWCsAGF-a3i9AJkThaPbuDYKKwHxvT7wL5HM-VeG-XtQOh9fliWeUKNC4AoWgRdgSTcgccDvIGxFXK7m5q9qbYcJ-0LKg96q0OEWLYGQLDmGJ8NFBdrJ84FB2yo5t333vqxQB7bIawmMepAzRuP1h2ytUUveF-2o9OaryUxMSjQHQBPyKLllCixdW_zr6Uv26HmV0fVjXsML_R9oPA_ZKVkDLx9p4C2C5QEsN1DSldDiI2clYa3l4VAjs6adh_LsDE6eW5LNHWJ9WwnWK9WcphrbT6Ef2XyzfUrrEfzjSz0tqsiW9-yDDQ0HHFVykjVBqVprg49wfUU7Rs9nqQSh4jdXm-FSu-pPCLqpGAU01uQMriiiZ2H2f9pH9UGHTSipV-1Wsxtx6C4I0mzbT3eRrJq0Jq4Q4vvzIy6GUuxpH9RFY2NMAhCoec9OG4Huszjnam-xLxKS7cuaZ5pSukb9oggKpwtqYAejcb4ndR65Fqq3a794vGR1XmkdJhjNFfhnPFcKh1A_uzegciwN7sEYVu7i-wgGV6Cz0S60Bj9kuT28'
  }
})
