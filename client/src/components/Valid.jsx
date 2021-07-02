function Valid(data, { username, password }) {
  for (let i = 0; i < data.customers.length; i++) {
    if (
      data.customers[i].email === username &&
      data.customers[i].password === password
    ) {
      return data.customers[i].id;
    }
  }
  return null;
}

export default Valid;
