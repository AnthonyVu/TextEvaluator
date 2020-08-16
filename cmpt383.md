### What is the overall goal of the project (i.e. what does it do, or what problem is it solving)?
I'm very interested in sociolinguistics, specifically with regards to the rise of new words. The idea of this project was that you would upload 5 different documents (for example, 
transcripts of dialogue used by young people in 2020), and the program would give you a relatively good idea of what is popular. You could also use this program for something more
fun like "what words does the current President of the United States like to use?"

### Which languages did you use, and what parts of the system are implemented in each?
I used JavaScript (React) to build my frontend, Golang for my backend, and Python to help process data in the backend.
### What methods did you use to communicate between languages?
1. I created a REST server using Golang to allow the frontend to send POST requests to the backend.
2. I used a Python script to sort the map of words and write the results to a JSON file. I then used Golang to send the sorted data from the JSON file to the client. Golang doesn't really have a simple way of sorting maps, which is why I used Python.
### Exactly what steps should be taken to get the project working, after getting your code? [This should start with vagrant up and can include one or two commands to start components after that.]
1. Open a shell/terminal as administrator (**windows commands**: Alt + f -> s -> a). Windows users will need to do this due to symbolic link issues on Vagrant. I'm not sure if this affects other operating systems but run as administrator just in case.
2. run 'vagrant up'
3. wait a bit (this may take a while; expect 10 to 20 minutes depending on your processor speed)
4. go to localhost:3000
5. select files to evaluate (test files can be found in 'TextEvaluator/test_files' directory if you don't want to download your own)
### What features should we be looking for when marking your project?
I tried my best to make my interface as visual as possible. When the results of the data are evaluated:
* a word cloud of a mixture of all nouns, adjectives, verbs, and adverbs are shown
* there are four separate bar charts for each category (nouns, adjectives, verbs, adverbs)
I also made use of what we learned about Golang in this course. When processing the files, I used goroutines and wait groups to semi-efficiently evaluate the data. I say semi-efficiently because there are definitely ways to improve the processing speed for larger files.
One thing that I would like to change in the future is to separate the files into different chunks to further increase the processing speed of the program.
