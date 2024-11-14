const rline = require("readline");
const fs=require('fs');
const {
  readFile,
  updateContent,
  deleteContent,
  writeContent,
  createFileIfNotExists
} = require("./fileManager");
const { execFileSync } = require("child_process");
// const { log } = require("console");

const filename='users.info';
const fileFiles='fileinfo';
function loadData(filepath){
if(fs.existsSync(filepath)){
  const data=fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(data);
}
return [];
}
function saveData(filepath,data){
  fs.writeFileSync(filepath,JSON.stringify(data,null,2));
}

function loadUsers(){
if(fs.existsSync(filename)){
  const data=fs.readFileSync(filename, 'utf8');
  return JSON.parse(data);
}
return [];
}
function saveUsers(users){
  fs.writeFileSync(filename, JSON.stringify(users,null,2));
}
const rl = rline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const userList=[];
let counter = 3;
function getSecret() {
  rl.question("Please, create an account. Enter you email address: ", (email) => {
const users=loadUsers();
const userEmail=email;
const have1=users.find((value)=>value.email===email);
const isEmail=email.includes('@gmail.com');
if(!isEmail){
  console.log('Please write an email address');
  getSecret();
}
else if(have1){
  console.log(`this ${email} has been taken. Choose another one`);
  getSecret();
}
else{
  function pass(){
    rl.question("Please enter your password: ", (password)=>{
    const isLength=password.length;

  const have2=users.find(value=>value.password===password);
  const hasLetters=/[a-zA-Z]/.test(password);
  const hasNumbers=/[0-9]/.test(password);
  const hasSpecialChars=/[!@$%^&*]/.test(password);

  if(isLength<7){
    console.log('Please choose a 8-digit password');
    pass();
  }
  else if(!(hasLetters&&hasNumbers&&hasSpecialChars)){
    console.log('Your password is weak. Create a strong one');
    pass();
  }
  
  else if(have2){
    console.log(`This password ${password} has been taken. Choose another one`);
    pass();
  }
  else{
    users.push({email,password});
    saveUsers(users);
    console.log('You have successfully registered');
    function askFilename(){
      rl.question("Please enter your filename: ", (filename)=>{
        const userFile=filename;
const files=loadData(fileFiles);
const fileExist=files.find(value=>value.name===filename);
if(fileExist&& fileExist.owner!==email){
  console.log(`This file name ${filename} has been used. Please choose another one`);
  askFilename();
}
else{
  const newFile={name:filename, owner:email, content:[] };
  files.push(newFile);
  saveData(fileFiles,files);
  createFileIfNotExists(filename);
  console.log(`File with name ${filename} has been created successfully` );
  function askTitle(){
    rl.question("Please enter task title: ", (title)=>{
      const currentTime=new Date().toISOString().slice(0, 10);
      rl.question("Please enter deadline: ", (deadline)=>{
        rl.question("Please enter status: ", (status)=>{
            const content=`Title:${title}| Time:${currentTime}| Deadline:${deadline}| Status:${status}\n`;
          fs.appendFileSync(userFile, `${content}\n`);
            console.log('Task has been added successfully');
 function commandFunction(){
  rl.question("Enter a command (type 'help' for a list of commands): ", (command)=>{
    if(command==="help"){
      console.log("\nAvailable commands:");
      console.log("1 view- View your tasks");
      console.log("2 add- add a new task to a file");
      console.log("3 update-update a task");
      console.log("4 delete- delete a task");
      commandFunction();
    }
    else if(command==="view"){
      rl.question("Enter the file name you want to views: ", (nameFile)=>{
        const nameOfTheFile=nameFile;
        function viewTask(){
          const files=loadData(fileFiles);
          const file=files.find(f=>f.name===userFile&&f.owner&&userEmail);
          if(!file){
            console.log('Error: File not found or access denied');
            commandFunction();
            return;
          }
else{
  const data=fs.readFileSync(nameOfTheFile, 'utf8');
  console.log(`\nTasks in ${nameOfTheFile}: \n${data}`);
  commandFunction();
}



        }
        viewTask();
      })
    }
    else if(command==="add"){
      rl.question("Enter the name of the file to which you want to add a task: ", (name)=>{
        const fileNomi=name;
const filesss='fileinfo';
      const fileSS=loadData(filesss);
      const filee=fileSS.find(f=>f.name===fileNomi && f.owner===userEmail);
        if(!filee) {
  
          console.log("Error:  File not found or access denied");
          commandFunction();

           } 
           else  {
            rl.question("Please enter the title: ", (title)=>{
              rl.question("Please enter deadline: ", (deadline)=>{
                const currentTime=new Date().toISOString().slice(0, 10);
                rl.question("Please enter status: ", (status)=>{
                  const content=`Title:${title}| Time:${currentTime}| Deadline:${deadline}| Status:${status}\n`;
                  fs.appendFileSync(fileNomi,`${content}\n`, "utf8");
                  commandFunction();
                })
              })
            })
            
           }

      
      })
    }
    else if(command==='update'){
      rl.question("Enter the filename you want to update: ", (filenomi)=>{
        const filesss='fileinfo';
      const fileSS=loadData(filesss);
      const filee=fileSS.find(f=>f.name===filenomi && f.owner===userEmail);
      if(!filee){
        console.log("Error:  File not found or access denied");
        commandFunction();
      }
      else{
     const data=fs.readFileSync(filenomi,'utf-8');
     const tasks=data.trim().split('\n');
     rl.question("Enter the row number of the task you want to update: ", (row)=>{
      const index=parseInt(row)-1;
      if(index<0 ||index>=tasks.length){
        console.log('Invalid row number');
        commandFunction();
      }
      rl.question('Enter a new title: ', (newTitle)=>{
        rl.question("Enter a new deadline: ", (newDeadline)=>{
          rl.question('Enter a new status: ', (newStatus)=>{
            const taskParts=tasks[index].split("|");
            const myDate = new Date().toISOString().slice(0, 10);
            const updatedTask=[
              `Title: ${newTitle|| taskParts[0].split(": ")[1]}`,
              `Time:${myDate||taskParts[1].split(": ")[1]}`,
              `Deadline: ${newDeadline||taskParts[2].split(": ")[1]}`,
              `Status: ${newStatus||taskParts[3].split(": ")[1]}`
            ].join("|");
            tasks[index]=updatedTask;

            fs.writeFileSync(filenomi, tasks.join("\n")+"\n");
            console.log("Task has been updated");
            commandFunction();
            
          })
        })
      })
     })
      }

        
      })
    }
    else if(command==='delete'){
      rl.question("Enter the filename: ", (filenomi1)=>{
        const filesss='fileinfo';
        const fileSS=loadData(filesss);
        const filee=fileSS.find(f=>f.name===filenomi1 && f.owner===userEmail);
        if(!files){
          console.log("Error:  File not found or access denied");
          commandFunction();
        }
        else{
          const data=fs.readFileSync(filenomi1,'utf-8');
          const tasks=data.trim().split('\n');
          rl.question("Enter the row number you want to delete: ", (rowNum)=>{
            const index=parseInt(rowNum)-1;
            if(index<0 ||index>=tasks.length){
              console.log('Invalid row number');
              commandFunction();
            }
            tasks.splice(index,1);
            fs.writeFileSync(filenomi1, tasks.join('\n'));
            console.log(`${rowNum}-row has been deleted `);
            commandFunction();
            
          })
        }
      })
    }
    else if(command==="create"){
      const filesss='fileinfo';
      const fileSS=loadData(filesss);
      rl.question("Enter the name of the new file you want to create: ", (newFile)=>{
const exist=fileSS.find(value=>value.name===newFile && value.owner===userEmail);
if(exist){
  console.log('Please choose a different name for a new file');
  commandFunction();
}
else{
  fs.writeFileSync(newFile,'');
  console.log(`A new file with ${newFile} has been created`);
  const neww={name:newFile, owner:userEmail};
  fileSS.push(neww);
  saveData(filesss,fileSS);
  commandFunction();
  
}
      })
    }
    else{
      console.log('Invalid command');
      commandFunction();
      
    }

   
  })
 }
 commandFunction();

          
        })
      })
    })
  }
  askTitle();
}
      })
    }
    askFilename();
  }
    })
  }
  pass(); 
}

});
}
getSecret();

function wait10seconds() {
  const myInterval = showSeconds();
  setTimeout(() => {
    counter = 3;
    rl.pause();
    getSecret();
    clearInterval(myInterval);
  }, 11000);
}

function showSeconds(a = 10) {
  return setInterval(() => {
    setPrompt(`${a--} seconds left`);
  }, 1000);
}

function setPrompt(data) {
  rl.setPrompt(data);
  rl.prompt();
}
const myDate = new Date().toISOString().slice(0, 10);
const commands = ["enter", "help", "select", "update", "delete", "write", 'create'];
rl.on("line", (str) => {
  const [command, ...others] = str.trim().split(",");

  if (commands.includes(command)) {
    commandList(command, others);
  } else {
    console.log("you entered wrong command");
  }
});
function commandList(command, filepath) {
  switch (command) {
    case "enter":
      readFile().then((data) => {
        data.forEach((item, index) => {
          const current = item.split("|");
          current.unshift("id");
          if (index === 0) {
            console.log(
              `\x1b[35m ${current.join(" ").toUpperCase()}    \x1b[0m`
            );
          } else if (item.length) {
            current.unshift(index);
            console.log(
              `\x1b[35m ${current.join(" ").toUpperCase()}    \x1b[0m`
            );
          }
        });
      });
      break;

    case "update":
      const filenomi = filepath.pop();
      const row=filepath.shift();
      
      filepath.push("updated");
      const shifted = filepath.shift();
      filepath.unshift(myDate);
      filepath.unshift(shifted);
      updateContent(row,filepath,filenomi);
      break;
    case "select":

      readFile(filepath.join()).then((data) => {
      
   data.forEach((item,index)=>{
    const current=item.split("|");
    if(index===0){
      console.log(`\x1b[35m ${current.join(" ").toUpperCase()}    \x1b[0m`);
    }
    else{
      console.log(`\x1b[32m${current.join(" ").toUpperCase()}    \x1b[0m`);
    }
    
   })
      });
      break;
    case "delete":
      const nom2=filepath.pop();
      deleteContent(parseInt(filepath[0]), nom2);
      break;
    case "write":
      const nom=filepath.pop();1,
filepath.push("recently created");
      const shifted1 = filepath.shift();
      filepath.unshift(myDate);
      filepath.unshift(shifted1);
      
      writeContent(filepath,nom);

      break;
      case 'create':
        const name=filepath.join();
        createFileIfNotExists(name);

  }
}




// user accaunt ochish kerak. va osha accountdana turib  bi nechta file yarata olishi kerak
// userlar malomotlari hammas filega saqlanishi kerak. 
// login unique bolishi kerak


// bir xil nomi fayl yaratiladigon bolsa, consolga warning chiwishi kerak
// agar har xil accauntdan turib bir xil fayl yaratiladigon bosa, time ni ishlatib bir biriga halaqit bermimiz. 
// show commanda qoshamiz va userning barcha fayllarini logga chiqaramiz.

