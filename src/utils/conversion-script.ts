import * as XLSX from 'xlsx';
import * as fs from 'fs';

// Define the JSON format
interface Metadata {
    description?: string;
    external_url?: string;
    image?: string;
    name?: string;
    attributes?: {
      trait_type?: string;
      value?: string | number;
      display_type?: string;
    }[];
}

// Read the Excel file
const workbook = XLSX.readFile('/home/phinelipy/Work/Blockchain/projects/Aquaticus-project/Characteristics.xlsx');

// Get the first sheet
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// Convert the worksheet into an array of JSON objects
// Convert the worksheet into an array of JSON objects
const data: Metadata[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).map((row: any) => {
    const obj: Metadata = {};
    row.forEach((cell: any) => {
      if (cell !== '') {
        const [key, ...rest] = cell.split(' ');
        const value = rest.join('_');
        obj[key as keyof Metadata] = value;
      }
    });
    return obj;
  });
// const data = XLSX.utils.sheet_to_json(worksheet);

// Write the JSON data into a file
fs.writeFile('output.json', JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
