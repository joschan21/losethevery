import { Configuration, OpenAIApi } from 'openai'
import { FC, useState } from 'react'

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

interface AppProps {}

const App: FC<AppProps> = ({}) => {
  const [input, setInput] = useState<string>('')
  const [suggestion, setSuggestion] = useState<string>('')

  const combineWords = async (secondWord: string) => {
    try {
      const result = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: `Combine the word "very" with another adjective to find a more suitable adjective.\n\nvery + cold = freezing\nvery + nice = charming\nvery + high = steep\nvery + shining = gleaming\nvery + ${secondWord} =`,
        temperature: 0.7,
        max_tokens: 25,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })

      if (!result.data.choices?.[0].text) throw new Error('Invalid response')
      const suggestion = result.data.choices[0].text

      setSuggestion(suggestion)
    } catch (error) {
      console.log(error)
    }
  }

  const getRandomAdjective = async () => {
    // Generate random adjective
    try {
      const result = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt:
          'Come up with one random adjective that goes well with the word "very" in front of it:\nAdjective: very',
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })

      if (!result.data.choices?.[0].text) throw new Error('Invalid response')
      const adjective = result.data.choices[0].text.trim()

      return adjective
    } catch (error) {
      throw new Error('Invalid action')
    }
  }

  // Handle random result
  const handleRandomResult = async () => {
    const adjective = await getRandomAdjective()
    setInput(adjective)
    handleGetResult(adjective)
  }

  // Handle input submission
  const handleGetResult = (input: string) => {
    combineWords(input)
  }

  return (
    <div className='max-w-6xl mx-auto min-h-screen flex flex-col items-center mt-32 mb-16 sm:text-center sm:mb-0'>
      <div className='w-12 h-12'>
        <img src='https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficon-icons.com%2Ficons2%2F931%2FPNG%2F512%2Fpencil_icon-icons.com_72386.png&amp;f=1&amp;nofb=1' />
      </div>
      <div className='text-gray-400 text-center'>
        Combine "very" with a simple adjective and get a more concise adjective
      </div>
      <div className='grid grid-cols-12 justify-center items-center w-full mb-4 py-16'>
        <p className='text-center col-span-2 text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold'>very</p>
        <p className='text-center col-span-1 text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold'>+</p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='boring'
          type='text'
          className='col-span-4 text-center border-b-2 font-sans text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold h-24 transition duration-200 bg-white  border-gray-300 appearance-none focus:outline-none'
        />
        <p className='text-center col-span-1 text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold'>=</p>
        <div className='text-center  w-96 col-span-4'>
          <p
            className={`cursor-pointer text-center text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold ${
              suggestion ? 'text-green-700' : 'text-gray-500'
            } font-serif`}>
            {suggestion || 'tedious'}
          </p>
        </div>
      </div>
      <div className='mb-4 flex flex-row'>
        <div className='pr-6 cursor-pointer'>
          <button
            type='button'
            onClick={() => handleGetResult(input)}
            className='border-solid bg-black inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none'>
            Get/Refresh Result
          </button>
        </div>
        <div className='pl-6 cursor-pointer'>
          <button
            type='button'
            onClick={handleRandomResult}
            className='border-solid bg-black inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none'>
            Random
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
