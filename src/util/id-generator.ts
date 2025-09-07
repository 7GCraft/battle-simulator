function* generateId() {
   let curr = 1;
   while (true) {
      yield curr.toString();
      curr++;
   }
}

const idGenerator = generateId();

export default idGenerator;
