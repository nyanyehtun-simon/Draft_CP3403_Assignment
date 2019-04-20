// Here I am creating separate functions not tied to either
// class and exporting them from the file.

const getValueInput = (mess) => {
    console.log(mess);
}

const filterNames = (mess) => {
    console.log("Names " + mess);
}

export { getValueInput, filterNames };