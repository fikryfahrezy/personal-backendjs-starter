# [Test Requirement](#test-requirement)

## [API](#api)

> The order of subtitles is following the order of the routes in the Postman

### [Example](#example)

---

#### [# Post Data](#post-data)

**[POSTMAN] [JEST]** Success

- Status code should `201`
- Header `Content-Type` should `application/json; charset=utf-8`
- Body should object with `success` property `true`

**[POSTMAN] [JEST]** Fail, Validation Fail

- Status code should `422`
- Header `Content-Type` should `application/json; charset=utf-8`
- Body should object with `success` property `false`

#### [# Get Data](#get-data)

**[POSTMAN] [JEST]** Success

- Status code should `200`
- Header `Content-Type` should `application/json; charset=utf-8`
- Body should object with `success` property `true`

#### [# Get Single Data](#get-single-data)

**[POSTMAN] [JEST]** Success, Found Single Data

- Status code should `200`
- Header `Content-Type` should `application/json; charset=utf-8`
- Body should object with `success` property `true`

**[POSTMAN] [JEST]** Fail, Data Not Found

- Status code should `404`
- Header `Content-Type` should `application/json; charset=utf-8`
- Body should object with `success` property `false`

#### [# Post File](#post-file)

**[POSTMAN] [JEST]** Success

- Status code should `201`
- Header `Content-Type` should `application/json; charset=utf-8`
- Body should object with `success` property `true`

**[POSTMAN] [JEST]** Fail, File Not Provided

- Status code should `422`
- Header `Content-Type` should `application/json; charset=utf-8`
- Body should object with `success` property `false`

#### [# Get Private Data](#get-private-data)

**[POSTMAN] [JEST]** Success

- Status code should `200`
- Header `Content-Type` should `application/json; charset=utf-8`
- Body should object with `success` property `true`

**[POSTMAN] [JEST]** Fail, Wrong Header Key

- Status code should `403`
- Header `Content-Type` should `application/json; charset=utf-8`
- Body should object with `success` property `false`

**[POSTMAN] [JEST]** Fail, Header Key Not Given

- Status code should `403`
- Header `Content-Type` should `application/json; charset=utf-8`
- Body should object with `success` property `false`
