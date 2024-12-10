import DatabaseClient from './client';

const client = new DatabaseClient('NayGolf125125', 'http://localhost:4589');

async function test() {
  try {
    // Test adding first item
    console.log('Adding first item...');
    const response1 = await client.addItem('makishop', 'users', {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });
    console.log('First item added:', response1.data);

    // Test adding second item
    console.log('\nAdding second item...');
    const response2 = await client.addItem('makishop', 'users', {
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25
    });
    console.log('Second item added:', response2.data);

    // Test getting all items
    console.log('\nGetting all items...');
    const allItems = await client.getAllItems('makishop', 'users');
    console.log('All items:', allItems.data);

    // Test getting random item
    console.log('\nGetting random item...');
    const randomItem = await client.getRandomItem('makishop', 'users');
    console.log('Random item:', randomItem.data);

    // Test getting items by condition
    console.log('\nGetting items where age > 25...');
    const conditionItems = await client.getWhere('makishop', 'users', { age: 30 });
    console.log('Filtered items:', conditionItems.data);

    // Test removing first item
    if (allItems.data && allItems.data.length > 0) {
      const firstItemId = allItems.data[0].id;
      console.log('\nRemoving item with ID:', firstItemId);
      const removeResponse = await client.removeItem('makishop', 'users', firstItemId);
      console.log('Remove response:', removeResponse.data);

      // Verify removal by getting all items again
      console.log('\nVerifying removal - getting all items again...');
      const remainingItems = await client.getAllItems('makishop', 'users');
      console.log('Remaining items:', remainingItems.data);
    }

  } catch (error: any) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

test();
