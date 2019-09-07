# rest-client

```js
import { connect } from '@yucom/rest-client';

const client = connect('http://localhost:8989');

const john = await client.get.people[123]();  // GET /people/123

const phones = await client.list.people[123].phones({type: 'mobile'});  // GET /people/123/phones?type=mobile

const john = await client.create.people({ name: 'John', lastname: 'Connor' }); // POST /people {"name":"John","lastname":"Connor"}

const john = await client.update.people[123]({ age: 27 }); // PATCH /people/123 {"age":27}

const john = await client.replace.people[123]({ name: 'Carl', lastname: 'Connor' });  // PUT /people/123 {"name":"John","lastname":"Connor"}

await client.remove.people[123](); // DELETE /people/123

const result = await client.invoke.admin/doStuff({ param1: 'Hello', param2: 2.21 });  // POST /admin/doStuff {"param1":"Hello","param2":"2.21"}

````