const rline = require("readline");
const fs=require('fs');
const { execFileSync } = require("child_process");
const { log } = require("console");
const filename='users.info';
const fileFiles='fileinfo';
const currentTime=new Date().toISOString().slice(0, 10);
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
let userPassword;
function createPassword(){
  rl.question("Please enter your password: ", (password)=>{
userPassword=password;
    const hasLetters=/[a-zA-Z]/.test(userPassword);
    const hasNumbers=/[0-9]/.test(userPassword);
    const hasSpecialChars=/[!@#$%^&*]/.test(userPassword);
    if(userPassword.length<7){
      console.log("Your password should be at least 8-digit");
      createPassword();
    }
    else if(!(hasLetters&&hasNumbers&&hasSpecialChars)){
      console.log("Your password is weak. Create a strong one");
      createPassword();
    }
    else{
      console.log("Your have successfully created an account");
      createFile();
      
    }
  })
}
let userEmail;
function createEmail(){
  rl.question("Please create an account.Enter your email address: ", (email)=>{
    userEmail=email;
    const userEmailCheck=loadUsers();
    const emailExist=userEmailCheck.find(value=>value.email===email);
    const isEmail=email.includes("@gmail.com");
    if(!isEmail){
      console.log("Please write an email address");
      createEmail();
    }
    else if(emailExist){
      console.log(`This ${email} has already been taken. Enter a different one`);
      createEmail();
    }
    else{
      console.log("Email has been successfully saved");
      createPassword();
      userEmailCheck.push({email,userPassword});
      saveUsers(userEmailCheck);
     
    }
  })
}
function askFileDetails(){
  rl.question("Please enter title: ", (title)=>{
    rl.question("Please enter deadline: ", (deadline)=>{
      rl.question("Please enter a status: ", (status)=>{
        const content=`Title: ${title}|Time:${currentTime}| Deadline:${deadline}|Status:${status}\n`;
        fs.appendFileSync(userFile,content);
        console.log('Task has been added successfully');
        commandFunctions();
      })
    })

  })
}
let userFile;
function createFile(){
  rl.question("Please enter a filename you want to create: ", (filename)=>{
userFile=filename;
const fileNameCheck=loadData();
const isFileExist=fileNameCheck.find(value=>value.name===filename);
if(isFileExist){
  console.log('This file has been taken. Please choose different name');
  createFile();
}
else{
  const fileData={name:userFile, owner:userEmail};
  fileNameCheck.push(fileData);
  saveData(fileFiles,fileNameCheck);
  console.log(`File with ${userFile} name has been created successfully`);
  askFileDetails();
}
  })
}
function checkAccess(filename){
  const fileAcess=loadData(fileFiles);
  const hasAccess=fileAcess.find(value=>value.name===filename&& value.owner===userEmail);
  if(!hasAccess){
   return false;
  }
  else{
return true;
  }
}
function commandFunctions(){
rl.question("Enter a command (type 'help' for a list of commands):", (command)=>{
  switch(command){
    case 'help':
      console.log("\nAvailable commands:");
      console.log("1 view- View your tasks");
      console.log("2 add- add a new task to a file");
      console.log("3 update-update a task");
      console.log("4 delete- delete a task");
      commandFunctions();
      break;
      case 'view' :
        rl.question("Enter the name of the file you want to view: ", (filename)=>{
            if(checkAccess(filename)===false){
              console.log('Error has occured or access denied');
              commandFunctions();
            }
            else{
              const data=fs.readFileSync(filename,'utf-8');
              console.log(`\nTasks in ${filename}: \n${data}`);
              commandFunctions();
            }
        })
        break;
        case 'add' :
          rl.question("Please enter the filename to which you want to add a task: ", (filename)=>{
            if(checkAccess(filename)===false){
              console.log('Error has occured or access denied');
              commandFunctions();
            }
            else{
              rl.question("Enter a title: ", (title)=>{
                rl.question("Enter a deadline: ", (deadline)=>{
                  rl.question("Enter a status; ", (status)=>{
                    const content=`Title:${title}| Time:${currentTime}| Deadline:${deadline}| Status:${status}`;
                    fs.appendFileSync(filename, `${content}\n,`, 'utf8');
                    commandFunctions();
                  })
                })
              })
            }
          })
          break;
          case 'update' :
            rl.question("Enter the name of the file you want to update: ", (filename)=>{
              if(checkAccess(filename)===false){
                console.log('Error has occured or access denied');
                commandFunctions();
              }
              else{
                const data=fs.readFileSync(filename,'utf-8');
                const tasks=data.trim().split('\n');
                rl.question("Enter the row number you want to update: ", (row)=>{
                  const index=parseInt(row)-1;
                  if(index<0 || index>tasks.length){
                    console.log('Invalid row number');
                    commandFunctions();
                  }
                  else{
                    rl.question("Enter a new title: ", (newTitle)=>{
                      rl.question("Enter a new deadline: ", (newDeadline)=>{
                        rl.question("Enter a new status: ", (newStatus)=>{
                          const taskElements=tasks[index].split("|");
                          const updatedTask=[
                            `Title: ${newTitle|| taskElements[0].split(": ")[1]}`,
                            `Time:${currentTime||taskElements[1].split(": ")[1]}`,
                            `Deadline: ${newDeadline||taskElements[2].split(": ")[1]}`,
                            `Status: ${newStatus||taskElements[3].split(": ")[1]}`
                          ].join("|");
                          tasks[index]=updatedTask;
                          fs.writeFileSync(filename, tasks.join("\n")+"\n");
                          console.log("Task has been updated");
                          commandFunctions();
                          
                        })
                      })
                    })
                  }
                })
              }
            })
            break;
            case 'delete' :
              rl.question("Enter the filename in which you want to delete a task: ", (filename)=>{
                if(checkAccess(filename)===false){
                  console.log('Error has occured or access denied');
                  commandFunctions();
                }
                else{
                  const data=fs.readFileSync(filename,'utf-8');
                  const tasks=data.trim().split('\n');
                  rl.question("Enter the row number you want to delete: ", (row)=>{
                    const index=parseInt(row)-1;
                    if(index<0 || index>=tasks.length){
                      console.log('Invalid row number');
                      commandFunctions();
                    }
                    else{
                      tasks.splice(index,1);
                      fs.writeFileSync(filename, tasks.join('\n'));
                      console.log(`${row}-row has been deleted `);
                      commandFunctions();
                    }
                  })
                }
              })
              break;
              case 'create' :
                rl.question("Enter the name of the file you want to create: ", (filename)=>{
                  const checkFile=loadData(fileFiles);
                  const isFileExist=checkFile.find(value=>value.name===filename && value.owner===userEmail);
                  if(isFileExist){
                    console.log('Please choose a different name for the new file');
                    commandFunctions();
                    
                  }
                  else{
                    fs.writeFileSync(filename, "");
                    console.log('File has been created successfully');
                    const newFile=({name:filename, owner:userEmail});
                    checkFile.push(newFile);
                    saveData(fileFiles,checkFile);
                    commandFunctions();
                    
                  }
                })
                break;
                default :
                console.log('Wrong command. Please try again');
                commandFunctions();
                break;


        
        

        
  }
})
}
  createEmail();
























//  function commandFunction(){
//   rl.question("Enter a command (type 'help' for a list of commands): ", (command)=>{
//     if(command==="help"){
//       console.log("\nAvailable commands:");
//       console.log("1 view- View your tasks");
//       console.log("2 add- add a new task to a file");
//       console.log("3 update-update a task");
//       console.log("4 delete- delete a task");
//       commandFunction();
//     }
//     else if(command==="view"){
//       rl.question("Enter the file name you want to views: ", (nameFile)=>{
//         const nameOfTheFile=nameFile;
//         function viewTask(){
//           const files=loadData(fileFiles);
//           const file=files.find(f=>f.name===userFile&&f.owner&&userEmail);
//           if(!file){
//             console.log('Error: File not found or access denied');
//             commandFunction();
//             return;
//           }
// else{
//   const data=fs.readFileSync(nameOfTheFile, 'utf8');
//   console.log(`\nTasks in ${nameOfTheFile}: \n${data}`);
//   commandFunction();
// }



//         }
//         viewTask();
//       })
//     }
//     else if(command==="add"){
//       rl.question("Enter the name of the file to which you want to add a task: ", (name)=>{
//         const fileNomi=name;
// const filesss='fileinfo';
//       const fileSS=loadData(filesss);
//       const filee=fileSS.find(f=>f.name===fileNomi && f.owner===userEmail);
//         if(!filee) {
  
//           console.log("Error:  File not found or access denied");
//           commandFunction();

//            } 
//            else  {
//             rl.question("Please enter the title: ", (title)=>{
//               rl.question("Please enter deadline: ", (deadline)=>{
//                 const currentTime=new Date().toISOString().slice(0, 10);
//                 rl.question("Please enter status: ", (status)=>{
//                   const content=`Title:${title}| Time:${currentTime}| Deadline:${deadline}| Status:${status}\n`;
//                   fs.appendFileSync(fileNomi,`${content}\n`, "utf8");
//                   commandFunction();
//                 })
//               })
//             })
            
//            }

      
//       })
//     }
//     else if(command==='update'){
//       rl.question("Enter the filename you want to update: ", (filenomi)=>{
//         const filesss='fileinfo';
//       const fileSS=loadData(filesss);
//       const filee=fileSS.find(f=>f.name===filenomi && f.owner===userEmail);
//       if(!filee){
//         console.log("Error:  File not found or access denied");
//         commandFunction();
//       }
//       else{
//      const data=fs.readFileSync(filenomi,'utf-8');
//      const tasks=data.trim().split('\n');
//      rl.question("Enter the row number of the task you want to update: ", (row)=>{
//       const index=parseInt(row)-1;
//       if(index<0 ||index>=tasks.length){
//         console.log('Invalid row number');
//         commandFunction();
//       }
//       rl.question('Enter a new title: ', (newTitle)=>{
//         rl.question("Enter a new deadline: ", (newDeadline)=>{
//           rl.question('Enter a new status: ', (newStatus)=>{
//             const taskParts=tasks[index].split("|");
//             const myDate = new Date().toISOString().slice(0, 10);
//             const updatedTask=[
//               `Title: ${newTitle|| taskParts[0].split(": ")[1]}`,
//               `Time:${myDate||taskParts[1].split(": ")[1]}`,
//               `Deadline: ${newDeadline||taskParts[2].split(": ")[1]}`,
//               `Status: ${newStatus||taskParts[3].split(": ")[1]}`
//             ].join("|");
//             tasks[index]=updatedTask;

//             fs.writeFileSync(filenomi, tasks.join("\n")+"\n");
//             console.log("Task has been updated");
//             commandFunction();
            
//           })
//         })
//       })
//      })
//       }

        
//       })
//     }
//     else if(command==='delete'){
//       rl.question("Enter the filename: ", (filenomi1)=>{
//         const filesss='fileinfo';
//         const fileSS=loadData(filesss);
//         const filee=fileSS.find(f=>f.name===filenomi1 && f.owner===userEmail);
//         if(!files){
//           console.log("Error:  File not found or access denied");
//           commandFunction();
//         }
//         else{
//           const data=fs.readFileSync(filenomi1,'utf-8');
//           const tasks=data.trim().split('\n');
//           rl.question("Enter the row number you want to delete: ", (rowNum)=>{
//             const index=parseInt(rowNum)-1;
//             if(index<0 ||index>=tasks.length){
//               console.log('Invalid row number');
//               commandFunction();
//             }
//             tasks.splice(index,1);
//             fs.writeFileSync(filenomi1, tasks.join('\n'));
//             console.log(`${rowNum}-row has been deleted `);
//             commandFunction();
            
//           })
//         }
//       })
//     }
//     else if(command==="create"){
//       const filesss='fileinfo';
//       const fileSS=loadData(filesss);
//       rl.question("Enter the name of the new file you want to create: ", (newFile)=>{
// const exist=fileSS.find(value=>value.name===newFile && value.owner===userEmail);
// if(exist){
//   console.log('Please choose a different name for a new file');
//   commandFunction();
// }
// else{
//   fs.writeFileSync(newFile,'');
//   console.log(`A new file with ${newFile} has been created`);
//   const neww={name:newFile, owner:userEmail};
//   fileSS.push(neww);
//   saveData(filesss,fileSS);
//   commandFunction();
  
// }
//       })
//     }
//     else{
//       console.log('Invalid command');
//       commandFunction();
      
//     }

   
//   })
//  }











