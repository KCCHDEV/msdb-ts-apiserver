import DatabaseClient from './client';

const client = new DatabaseClient('NayGolf125125', 'http://localhost:4589');

async function test() {
  try {
    console.log('Adding first item...');
    const response1 = await client.addItem('makishop', 'users', {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });
    console.log('First item added:', response1);
    const firstId = response1.id;
    await new Promise(resolve => setTimeout(resolve, 1000));
    const verifyGet = await client.getItem('makishop', 'users', firstId);
    console.log('\nVerifying saved item:', verifyGet);
    console.log('\nAdding second item...');
    const secondId = 'user2';
    const response2 = await client.addItem('makishop', 'users', {
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25
    }, secondId);
    console.log('Second item added:', response2);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('\nGetting all items...');
    const allItems = await client.getAllItems('makishop', 'users');
    console.log('All items:', allItems);
    console.log('\nGetting random item...');
    const randomItem = await client.getRandomItem('makishop', 'users');
    console.log('Random item:', randomItem);
    console.log('\nGetting items where age = 30...');
    const conditionItems = await client.getWhere('makishop', 'users', { age: 30 });
    console.log('Filtered items:', conditionItems);
    if (firstId) {
      console.log('\nRemoving item with ID:', firstId);
      const removeResponse = await client.removeItem('makishop', 'users', firstId);
      console.log('Remove response:', removeResponse);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('\nVerifying removal - getting all items again...');
      const remainingItems = await client.getAllItems('makishop', 'users');
      console.log('Remaining items:', remainingItems);
    }

  } catch (error: any) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

test();
