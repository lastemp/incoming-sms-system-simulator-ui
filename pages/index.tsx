import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import fetch, { Headers } from 'node-fetch'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

// Request params
type MessageNotification = {
  date: string,
  from: string,
  id: string,
  linkId: string,
  text: string,
  to: string
}

// Response params
type Message = {
  role: string
  content: string
}

type Choice = {
  index: number
  message: Message
  finish_reason: string
}

type Usage = {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

type CompletionResponse = {
  status_code: number
  status_description: string
  exam_result: string
}

// We define the model to use
const model: string = 'gpt-3.5-turbo'
// Lets create an array to hold messages
const messages: Message[] = [];
// Lets create default system message
const systemMessage: Message =  { role: 'system', content: 'You are a helpful assistant.' }

function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}
 
const MyComponent: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [inputValue, setInputValue] = useState<string>(''); // State to hold the input value

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  let myid = uuidv4();
  let mylinkId = uuidv4();
  let mytext = inputValue;

  const currentDate = new Date();
  const formattedDate = formatDateTime(currentDate);

  // Lets convert our custome type to json
  const body = JSON.stringify({
    date: formattedDate,//"2023-11-23 15:28:30",
    from: "+2547xxxx",
    id: myid,//"6a11966a-fb55-4422-a010-6dc64d7b9860",
    linkId: mylinkId,//"bb922dcd-769f-4288-82d7-910e1fe809af",
    text: mytext,//"1245",
    to: "xxxx"
  });

  console.log('body: ', body);

  const handleButtonClick = async () => {
    try {
      // Make the API call using node-fetch
      const apiUrl = 'http://127.0.0.1:xxxx/xxxx'
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body,
      })
      //const responseData = await response.json();
      let responseData
      let resp
      if (response !== undefined) {responseData = await response.json()} else responseData = null
      // && responseData.status_description !== null
      //if (responseData !== null) {resp = responseData.status_description} else resp = 'Error occured on accessing API'
      if (responseData !== null) 
        {
          if (responseData.status_code === 0)
          {resp = responseData.exam_result}
          else {resp = responseData.status_description}
        } 
      else resp = 'Error occured on accessing API'
        //console.log(responseData !== null? responseData : 'Error occured on accessing API')
        setData(resp);
    } catch (error) {
      console.error('Error making API call:', error);
    }
  };

   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <p><label htmlFor="message">SMS Message</label></p>
      <p><input type="text" id="message" name="message" maxLength={10} value={inputValue} onChange={handleInputChange} required /></p>
      <button onClick={handleButtonClick}>click to send SMS</button>
      {data && (
        <div>
          {/* <h2>API Response:</h2> */}
          <p><label htmlFor="response">SMS Response</label></p>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          <pre>{data}</pre>
        </div>
      )}
    </div>
  );
};

const HomePage: React.FC = () => {
  return (
    <div>
      {/* <h1>Next.js TypeScript API Call</h1> */}
      <h1>Examinations result SMS simulator</h1>
      <MyComponent />
    </div>
  );
};

export default HomePage;

