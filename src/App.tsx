import { useState, useEffect, ChangeEvent } from "react";
import "./App.css";

// var fs = require("fs");

type Expense = {
  Name: string;
  Cost: number;
};

function App() {
  const [file, setFile] = useState<File | undefined>();
  const [myCosts, setMyCosts] = useState(0);
  const [owedCosts, setOwedCosts] = useState(0);

  const [unsortedItems, setUnsortedItems] = useState<Expense[]>([]);
  const [personalItems, setPersonalItems] = useState<Expense[]>([]);
  const [sharedItems, setSharedItems] = useState<Expense[]>([]);

  const convertCsvToJson = (csvData: any) => {
    const rows = csvData.split("\r\n");
    const headers = rows[0].split(",");
    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(",");
      const obj: Partial<Expense> = {};
      for (let j = 0; j < headers.length; j++) {
        let header = headers[j] as keyof Expense;
        obj[header] = rowData[j];
      }
      data.push(obj);
    }
    console.log("JSON DATA", data);
    return data as Expense[];
  };

  const addToMyCosts = (cost: number) => {
    setMyCosts((prev) => prev + cost);
  };
  const addToOwedCosts = (cost: number) => {
    setMyCosts((prev) => prev + cost / 2);
    setOwedCosts((prev) => prev + cost / 2);
  };

  const handleFileChange = (event: any) => {
    console.log(event.target.files);
    const file = event.target.files[0]; // access the uploaded file
    setFile(file);
  };

  const handleFileUpload = () => {
    if (file) {
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = (event) => {
        const content = event.target?.result;
        const jsonData = convertCsvToJson(content);
        setUnsortedItems(jsonData);
      };
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col items-center justify-center flex-grow bg-gray-100 dark:bg-gray-900">
        <section className="flex flex-col items-center justify-center gap-8 w-full max-w-[800px] px-4 py-8">
          <header className="w-full">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              Finances
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Decide what to do with each item
            </p>
          </header>
          <div className="w-full flex flex-col items-center justify-center gap-8">
            {unsortedItems.length > 0 && (
              <div className="w-full flex flex-col items-center justify-center relative">
                <UnsortedExpense
                  title={unsortedItems[unsortedItems.length - 1].Name}
                  price={`$${unsortedItems[unsortedItems.length - 1].Cost}`}
                />
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 py-2">
                  <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full shadow">
                    Just Me
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow">
                    Shared
                  </button>
                </div>
              </div>
            )}

            <NewItemForm />
          </div>
          <div className="w-full flex justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Personal Items
              </h2>
              <div className="flex flex-col gap-4">
                <SortedExpense title="Leather Wallet" price="$89.99" />
                <SortedExpense
                  title="Noise Cancelling Headphones"
                  price="$199.99"
                />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Shared Items
              </h2>
              <SortedExpense title="Smart TV" price="$499.99" />
            </div>
          </div>
          <div className="w-full flex justify-between gap-8 mt-8">
            <CategorySummary categoryName="Spent on me" amount="$589.98" />
            <CategorySummary categoryName="Owed to me" amount="$499.99" />
          </div>
          <FileUpload
            onFileChange={handleFileChange}
            onFileUpload={handleFileUpload}
          />
        </section>
      </main>
      <footer className="bg-gray-200 dark:bg-gray-800 py-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">© 2024 Financey</p>
      </footer>
    </div>
  );
}

type ExpenseProps = {
  title: string;
  price: string;
};

const UnsortedExpense = ({ title, price }: ExpenseProps) => {
  return (
    <div className="w-full max-w-[400px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {title}
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400">{price}</p>
    </div>
  );
};

const SortedExpense = ({ title, price }: ExpenseProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{price}</p>
      </div>
    </div>
  );
};

const NewItemForm = () => {
  return (
    <div className="w-full max-w-[400px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Create New Item
      </h2>
      <input
        className="border-2 border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 text-gray-800 dark:text-gray-100 bg-transparent"
        placeholder="Item Name"
        type="text"
      />
      <input
        className="border-2 border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 text-gray-800 dark:text-gray-100 bg-transparent"
        placeholder="Price"
        type="number"
      />
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow">
        Add Item
      </button>
    </div>
  );
};

type FileUploadProps = {
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
};

const FileUpload = ({ onFileChange, onFileUpload }: FileUploadProps) => {
  return (
    <div className="w-full max-w-[400px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col gap-4 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Upload CSV File
      </h2>
      <input
        onChange={onFileChange}
        accept=".csv"
        className="border-2 border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 text-gray-800 dark:text-gray-100 bg-transparent"
        type="file"
      />
      <button
        onClick={onFileUpload}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow"
      >
        Upload
      </button>
    </div>
  );
};

type CategorySummaryProps = {
  categoryName: string;
  amount: string;
};

const CategorySummary = ({ categoryName, amount }: CategorySummaryProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex-1">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {categoryName}
      </h2>
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        {amount}
      </p>
    </div>
  );
};

export default App;
