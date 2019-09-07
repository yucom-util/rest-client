import { connect } from '../src/rest-client';
import express from 'express';
import BodyParser from 'body-parser';
import { ErrorCodes } from '../src/error-codes';

const isEmpty = (o: object) => Object.keys(o).length === 0;

const app = express();
app.use(BodyParser.json());

// List
app.get('/personas/123/phones', function (req, res) {
  res.json({ data: [1, 'Foo', req.query] });
});

// Get
app.get('/personas/123', function (req, res) {
  res.json({ data: req.query });
});

// Create
app.post('/personas/', function (req, res) {
  res.json({ data: Object.assign({ id: '123', qs: req.query }, req.body) });
});
app.post('/noData/', function (req, res) {
  res.json({ });
});
app.post('/noBody/', function (req, res) {
  res.send();
});

// Update
app.patch('/personas/:id', function (req, res) {
  res.json({ data: Object.assign({ id: req.params.id, qs: req.query }, req.body) });
});

// Replace
app.put('/personas/:id', function (req, res) {
  res.json({ data: Object.assign({ id: req.params.id, qs: req.query }, req.body) });
});

// Remove
app.delete('/personas/:id', function (req, res) {
  res.send();
});

// Invoke
app.post('/perform', function (req, res) {
  res.json({ data: { body: req.body, qs: req.query }});
});


let server;
const ready = new Promise((resolve, reject) => {
  server = app.listen(8989, async function() {
    resolve();
  });
});
const client = connect('http://localhost:8989');

describe('REST Client', () => {
  describe('List', () => {
    test('No options.', async done => {
      await ready;
      try {
        const array = await client.list.personas[123].phones();
        expect(array).toHaveLength(3);
        expect(array[0]).toBe(1);
        expect(array[1]).toBe('Foo');
        expect(isEmpty(array[2])).toBeTruthy();
        done();
      } catch (err) {
        done(err);
      }
    });
    test('With options.', async done => {
      await ready;
      try {
        const array = await client.list.personas[123].phones({type: 'mobile'});
        expect(array).toHaveLength(3);
        expect(array[0]).toBe(1);
        expect(array[1]).toBe('Foo');
        expect(array[2].type).toBe('mobile');
        done();
      } catch (err) {
        done(err);
      }
    });
    test('With array options.', async done => {
      await ready;
      try {
        const array = await client.list.personas[123].phones(['hello']);
        expect(array[2][0]).toBe('hello');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('Get', () => {
    test('No arguments.', async done => {
      await ready;
      try {
        const result = await client.get.personas[123]();
        expect(isEmpty(result)).toBeTruthy();
        done();
      } catch (err) {
        done(err);
      }
    });
    test('With object options.', async done => {
      await ready;
      try {
        const result = await client.get.personas[123]({type: 'mobile'});
        expect(result.type).toBe('mobile');
        done();
      } catch (err) {
        done(err);
      }
    });
    test('With id.', async done => {
      await ready;
      try {
        const result = await client.get.personas(123);
        expect(isEmpty(result)).toBeTruthy();
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('Create', () => {
    test('Invalid response: no body', async done => {
      await ready;
      try {
        const result = await client.create.noBody({ name: 'John' });
        expect(result.id).toStrictEqual('123');
        fail('No body caused no error.');
      } catch (err) {
        expect(ErrorCodes.responseError.noBody.is(err)).toBeTruthy();
        done();
      }
    });
    test('Invalid response: no data', async done => {
      await ready;
      try {
        const result = await client.create.noData({ name: 'John' });
        expect(result.id).toStrictEqual('123');
        fail('No data caused no error.');
      } catch (err) {
        expect(ErrorCodes.responseError.noData.is(err)).toBeTruthy();
        done();
      }
    });
    test('No arguments.', async done => {
      await ready;
      try {
        const result = await client.create.personas();
        expect(result.id).toStrictEqual('123');
        done();
      } catch (err) {
        done(err);
      }
    });
    test('No options.', async done => {
      await ready;
      try {
        const result = await client.create.personas({ name: 'John', lastname: 'Connor' });
        expect(result.id).toStrictEqual('123');
        expect(result.name).toStrictEqual('John');
        expect(result.lastname).toStrictEqual('Connor');
        expect(JSON.stringify(result.qs)).toStrictEqual('{}');
        done();
      } catch (err) {
        done(err);
      }
    });
    test('With object options.', async done => {
      await ready;
      try {
        const result = await client.create.personas({ name: 'John', lastname: 'Connor' }, { hello: 'world'});
        expect(result.id).toStrictEqual('123');
        expect(result.name).toStrictEqual('John');
        expect(result.lastname).toStrictEqual('Connor');
        expect(result.qs.hello).toStrictEqual('world');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('Update', () => {
    test('With arguments.', async done => {
      await ready;
      try {
        const result = await client.update.personas[123]({ foo: 'bar', x: 5 });
        expect(result.id).toStrictEqual('123');
        expect(result.foo).toStrictEqual('bar');
        expect(result.x).toStrictEqual(5);
        done();
      } catch (err) {
        done(err);
      }
    });
    test('No arguments', async done => {
      await ready;
      try {
        await client.update.personas[123](<object><unknown>null);
        fail('No arguments caused no error.');
      } catch (err) {
        expect(ErrorCodes.badRequest.is(err)).toBeTruthy();
        done();
      }
    });
  });

  describe('Replace', () => {
    test('No options.', async done => {
      await ready;
      try {
        const result = await client.replace.personas[123]({ name: 'John', lastname: 'Connor' });
        expect(result.id).toStrictEqual('123');
        expect(result.name).toStrictEqual('John');
        expect(result.lastname).toStrictEqual('Connor');
        expect(JSON.stringify(result.qs)).toStrictEqual('{}');
        done();
      } catch (err) {
        done(err);
      }
    });
    test('With options.', async done => {
      await ready;
      try {
        const result = await client.replace.personas[123]({ name: 'John', lastname: 'Connor' }, { foo: 'bar' });
        expect(result.id).toStrictEqual('123');
        expect(result.name).toStrictEqual('John');
        expect(result.lastname).toStrictEqual('Connor');
        expect(JSON.stringify(result.qs)).toStrictEqual('{"foo":"bar"}');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('Remove', () => {
    test('No arguments.', async done => {
      await ready;
      try {
        await client.remove.personas[123]();
        done();
      } catch (err) {
        done(err);
      }
    });
    test('With object options.', async done => {
      await ready;
      try {
        await client.remove.personas[123]({type: 'mobile'});
        done();
      } catch (err) {
        done(err);
      }
    });
    test('With id.', async done => {
      await ready;
      try {
        await client.remove.personas(123);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('Invoke', () => {
    test('No arguments.', async done => {
      await ready;
      try {
        const result = await client.invoke.perform();
        expect(JSON.stringify(result.body)).toStrictEqual('{}');
        expect(JSON.stringify(result.qs)).toStrictEqual('{}');
        done();
      } catch (err) {
        done(err);
      }
    });
    test('No options.', async done => {
      await ready;
      try {
        const result = await client.invoke.perform({ name: 'John', lastname: 'Connor' });
        expect(result.body.name).toStrictEqual('John');
        expect(result.body.lastname).toStrictEqual('Connor');
        expect(JSON.stringify(result.qs)).toStrictEqual('{}');
        done();
      } catch (err) {
        done(err);
      }
    });
    test('With object options.', async done => {
      await ready;
      try {
        const result = await client.invoke.perform({ name: 'John', lastname: 'Connor' }, { hello: 'world'});
        expect(result.body.name).toStrictEqual('John');
        expect(result.body.lastname).toStrictEqual('Connor');
        expect(result.qs.hello).toStrictEqual('world');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  afterAll(() => {
    server.close();
  });
});
