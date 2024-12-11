import DatabaseClient from './client';

const client = new DatabaseClient('NayGolf125125', 'http://localhost:4589');

async function test() {
  try {
    // Test adding first item with generated ID
    console.log('Adding first item...');
    const response1 = await client.addItem('makishop', 'users', {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });
    console.log('First item added:', response1);
    const firstId = response1.id;

    // Wait a bit for the data to be saved
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify the item was saved by retrieving it
    const verifyGet = await client.getItem('makishop', 'users', firstId);
    console.log('\nVerifying saved item:', verifyGet);

    // Test adding second item with explicit ID
    console.log('\nAdding second item...');
    const secondId = 'user2';
    const response2 = await client.addItem('makishop', 'users', {
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25
    }, secondId);
    console.log('Second item added:', response2);

    // Wait a bit for the data to be saved
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test getting all items
    console.log('\nGetting all items...');
    const allItems = await client.getAllItems('makishop', 'users');
    console.log('All items:', allItems);

    // Test getting random item
    // console.log('\nGetting random item...');
    // const randomItem = await client.getRandomItem('makishop', 'users');
    // console.log('Random item:', randomItem);

    // Test getting items by condition
    console.log('\nGetting items where age = 30...');
    const conditionItems = await client.getWhere('makishop', 'users', { age: 30 });
    console.log('Filtered items:', conditionItems);

    if (firstId) {
      // Test removing first item
      console.log('\nRemoving item with ID:', firstId);
      const removeResponse = await client.removeItem('makishop', 'users', firstId);
      console.log('Remove response:', removeResponse);

      // Wait a bit for the data to be saved
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify removal
      console.log('\nVerifying removal - getting all items again...');
      const remainingItems = await client.getAllItems('makishop', 'users');
      console.log('Remaining items:', remainingItems);
    }

  } catch (error: any) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

test();
