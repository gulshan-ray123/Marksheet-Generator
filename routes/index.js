const express = require("express");
const session= require('express-session');
require('dotenv').config();
const app = express();
const multer  = require('multer')
const ReportInfo = require('../model/ReportCard');
const marksModel= require('../model/Marksheet');
const disciplineModel=require('../model/Disciplinemarks');
const bcrypt=require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const studentModel= require('../model/stuReg');
const regModel=require('../model/Register');
const regAdminModel=require('../model/adminRegform')
const RegisterLogoModel= require('../model/SchoolLogo')
const cloudinary= require('cloudinary');
const port= process.env.SERVER_PORT || 3000;
const { OAuth2Client } = require('google-auth-library');
cloudinary.v2.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
// Start the server
const {requireAuth}= require('../middleware/protected');
const {adminAuth}=require('../middleware/adminprotected')
const jwtSecretKey= process.env.SECRET_KEY;
const { v4: uuidv4 } = require('uuid');
const { faErlang } = require('@fortawesome/free-brands-svg-icons');
uuidv4();
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads')
//   },
//   filename: function (req, file, cb) {
//     console.log(file);
//     const random = uuidv4();
//     cb(null, random+""+ file.originalname)
//   }
// })
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })


/* GET home page. */
app.get('/', function(req, res) {
  res.render("mainPage.ejs");
});

// Session Setup
const MongoStore = require('connect-mongo');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL,  // Your MongoDB connection string
        ttl: 14 * 24 * 60 * 60  // Session TTL (14 days)
    })
}));
// Google authentication

// Replace these with your actual Google Client ID and Client Secret
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URL;
const SECRET_KEY = process.env.ADMIN_SECURITY_KEY;
const RESULT_KEY=process.env.RESULT_SECURITY_KEY;

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);


// Route to initiate Google OAuth2 login
// Route to initiate Google OAuth2 login
app.get('/auth/google', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  });
  res.redirect(authUrl);
});

// Callback route after Google OAuth2 login
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code is missing');
  }

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Verify the ID token
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    req.session.user=payload;
    const userId = payload.sub; // Unique Google ID for the user
    const email = payload.email; // User's email
    const name = payload.name; // User's full name

    console.log('User authenticated:', { userId, email, name });

    // Save user data to your database or session here
    // For example, you can create a session for the user

   res.redirect('/view/marksheet/student/google')
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).send('Authentication failed');
  }
});
function googleAuth(req,res,next){
  if(req.session.user) return next();
  res.redirect('/home/login/page')
}
// Route for Login Page
app.get('/home/login/page',(req,res)=>{
  res.render("login.ejs");
})
// route for ReportCard Blueprint
app.get('/blueprint/ReportCard',adminAuth,(req,res)=>{
  res.render("ReportBlueprint.ejs")
})
// Route for BluePrint of Marksheets.
app.post('/blueprint/Marksheet', async(req,res)=>{
  // const user= await studentModel.findOne({enrollement: req.body.eid});
  // const schoolData= await ReportInfo.findOne({AffiliationNo: req.body.aff_id});
  // const marksheet = await marksModel.find({Enrollement: req.body.eid});
  // creating marks
  let{max_thry, max_prac, opt, theory, prac, total_marks,grade,eid, 
    theory_term2,prac_term2,total_marks2,grade2,dis_grade,dis_grade2}=req.body;
  const MarksInfo=  await marksModel.create({
    Enrollement:eid,
    MaxTheory:max_thry,
    MaxPracticle: max_prac,
    Subject:opt,
    Theory_term1:theory,
    Practicle_term1: prac,
    MarksObtained_term1: total_marks,
    Grade: grade,
    Discipline_term1:dis_grade,
    Theory_term2:theory_term2,
    Practicle_term2:prac_term2,
    MarksObtained_term2:total_marks2,
    Grade2:grade2,
    Discipline_term2:dis_grade2,
  });
  if(MarksInfo){
    console.log("Successfully created");
    console.log(MarksInfo);
    res.redirect('/fill/marks');
  }
  else{
    console.log("Not Created");
  }
  // console.log(schoolData);
  // console.log(user);
  // console.log(marksheet);
  // res.render("Blueprint.ejs",{user,schoolData});
});
// Route for student Reg.
app.get('/studentRegistration',adminAuth,(req, res,next) => {
  res.render('loginmarksheet.ejs');
});
// Route for error:
app.get('/error',(req, res) => {
  res.render('error.ejs');
})
// Route for Result.
app.post('/result',async(req, res)=>{
  let{sec_key_new}=req.body;
  const user= await studentModel.findOne({enrollement: req.body.enroll});
  const schoolData= await ReportInfo.findOne({AffiliationNo: req.body.aff_id});
  const marksheet = await marksModel.find({Enrollement: req.body.enroll});
  const discipline= await disciplineModel.findOne({Enrollement:req.body.enroll}); 
  const SchoolLogo= await RegisterLogoModel.findOne({AffNo: req.body.aff_id})
  const totalMarks= await marksModel.aggregate([
    {
      $group:{
        _id: "Enrollement",
        totalMarks_theory: {$sum:"$MaxTheory"},
        totalMarks_practicle: {$sum:"$MaxPracticle"},
        obtainedMarks_theory1: {$sum:"$Theory_term1"},
        obtainedMarks_practicle1: {$sum:"$Practicle_term1"},
        obtainedMarks_theory2: {$sum:"$Theory_term2"},
        obtainedMarks_practicle2: {$sum:"$Practicle_term2"},
      },
    },
    {
      $project:{
        _id:1,
        totalMarks_theory:1,
        totalMarks_practicle:1,
        obtainedMarks_theory1:1,
        obtainedMarks_practicle1:1,
        obtainedMarks_theory2:1,
        obtainedMarks_practicle2:1,
        totalSum:{$add:["$totalMarks_theory","$totalMarks_practicle"]},
        totalSum_obtained_term1:{$add:["$obtainedMarks_theory1","$obtainedMarks_practicle1"]},
        percentage_term1:{$multiply:[{$divide:["$totalSum_obtained_term1","$totalSum"]},100]},
        totalSum_obtained_term2:{$add:["$obtainedMarks_theory2","$obtainedMarks_practicle2"]},
        percentage_term2:{$multiply:[{$divide:["$totalSum_obtained_term2","$totalSum"]},100]}
      }
    },
    {
      $project:{
        _id:1,
        totalSum:1,
        totalSum_obtained_term1:1,
        totalSum_obtained_term2:1,
        totalFinalMax:{$multiply:["$totalSum",2]},
        totalFinalObt:{$add:["$totalSum_obtained_term1","$totalSum_obtained_term2"]},
        percentage_term1:{$multiply:[{$divide:["$totalSum_obtained_term1","$totalSum"]},100]},
        percentage_term2:{$multiply:[{$divide:["$totalSum_obtained_term2","$totalSum"]},100]},
      }
    },
    {
      $project:{
        _id:1,
        totalSum:1,
        totalSum_obtained_term1:1,
        totalSum_obtained_term2:1,
        percentage_term1:1,
        percentage_term2:1, 
        totalFinalMax:1,
        totalFinalObt:1, 
        percentage_term_final:{$multiply:[{$divide:["$totalFinalObt","$totalFinalMax"]},100]},
      }
    },
  ]);
  console.log(marksheet);
  console.log(discipline);
  console.log(totalMarks);
  console.log(SchoolLogo);
  
  if(sec_key_new==discipline.Result_key){
    res.render("Blueprint.ejs",{user,schoolData,marksheet,discipline,totalMarks,SchoolLogo});
  }
  else{
    res.redirect('/error')
  }
})

// app.get('/final/marksheet', (req,res)=>{
//   const schoolData=  ReportInfo.findOne({AffiliationNo: req.body.aff_id});
//   console.log(schoolData);
//   res.render('Blueprint.ejs',{schoolData});
// });
// Route for Submitting Report Card Info
// Route for uploading files.
// app.post('/upload/logo',upload.single('school_logo'),(req,res)=>{
//   const data= "Uploaded Successfully";
//   res.render("mainPage.ejs",{data});
// })

// Route for viewing Marksheet
app.get('/view/marksheet/admin',adminAuth,(req,res)=>{
  res.render('showMarkSheet.ejs');
});
app.get('/view/marksheet/student/google',googleAuth,(req,res)=>{
  res.render('studentResult.ejs');
});
app.get('/view/marksheet/student',requireAuth,(req,res)=>{
  res.render("studentResult.ejs");
})
// Route to register user.
// app.post('/register',async(req,res)=>{
//   let{user_name,email,con_pass}=req.body;
// const user= await userModel.create({
//   username:user_name,
//   email:email,
//   confirmPassword:con_pass
// })
// console.log("User Created successfully!");
// console.log(user);
// res.redirect('/blueprint/Marksheet')
// });
// Route for student verification.
// Route for Student Registeration.
app.post('/stu/registration',upload.single('school_logo'),async(req,res)=>{
  let{enrollement,stu_name,fth_name,mth_name,dob,add,class_name,roll,hos_name}= req.body;
  console.log(req.file);
  // const uploadResult = await cloudinary.uploader
  // .upload(
  //    req.file.path
  // )
  // .catch((error) => {
  //     console.log(error);
  // });
  // console.log(uploadResult);
  // //Delete file 
  // fs.unlink(req.file.path,
  //   (err)=> {
  //       if (err) console.log(err);
  //       else {
  //           console.log("\nDeleted file");
  //       }
  
  //   });
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload_stream({ folder: 'uploads' }, (error, result) => {
            if (error) return res.status(500).json({ error: error.message });
            res.json({ success: true, url: result.secure_url });
        }).end(req.file.buffer); // Send the buffer to Cloudinary
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
    const student= await studentModel.create({
      enrollement:enrollement,
      studentName:stu_name,
      fatherName: fth_name,
      motherName:mth_name,
      DateofBirth:dob,
      Address:add,
      Roll:roll,
      Class_name:class_name,
      HouseName:hos_name,
      Image:result.secure_url,
      // Subject:{
      //   English:{
      //     theory: req.body.English,
      //     practicle: req.body.English
      //   }
      // }
    })
    console.log("Student Registered Successfully!");
    console.log(student);
  res.redirect('/success');
})
// Route for Marks filling.
  app.get('/fill/marks',adminAuth,(req, res) => {
    res.render('marksfill.ejs');
  });

  // Route for discplinary grade.
  app.post('/disciplinary/grade',async(req,res)=>{
    let{dis_eid,dis_aff_id,dis_grade,dis_grade2,teacher_rem,prom}=req.body;
    const disciplineMarks= await disciplineModel.create({
      Enrollement:dis_eid,
      Affiliation:dis_aff_id,
      Dis_term1:dis_grade,
      Dis_term2:dis_grade2,
      Teacher_Remarks:teacher_rem,
      Promoted:prom,
      Result_key:RESULT_KEY,
    })
    console.log(disciplineMarks);
    res.redirect('/success');
  });
  //Route to show Dispilinary Page
  app.get('/dis/page',adminAuth,(req,res)=>{
    res.render('DisciplinaryMarks.ejs');
  });
  // Route for Sucess
  app.get('/success',(req, res) => {
    res.render('success.ejs');
  });
// Route for Register:
app.post('/register',(req,res)=>{
  let{user_name,email,con_pass}=req.body;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(con_pass, salt, async function(err, hash) {
      let createdUser=await regModel.create({
       username:user_name,
       email:email,
       password:hash,
      });
      console.log(createdUser);
    });
  });
  res.redirect('/success');
})

// Route for Login:


app.post('/login',async(req,res)=>{
  let users= await regModel.findOne({email: req.body.email});
  console.log(users);
  if(!users) res.send("Something went wrong");
  
  bcrypt.compare(req.body.pass,users.password,(err,result)=>{
   if(!result) res.redirect('/login');
   else {
     let token=jwt.sign({email:users.email},jwtSecretKey);
     console.log(token);
     res.cookie("token",token,{
       expires:new Date(Date.now()+1209600000),
       httpOnly:true
     });
     res.redirect('/view/marksheet/student')
   } 
   console.log(result);
  
  });
});
// Route for logout
app.get('/logout',(req,res)=>{
  res.cookie("token","")
  res.redirect('/');
});
// Route for Marksheet Info:
app.post('/markSheetInfo',async(req,res)=>{
  let{school_name,board_name,aff_no,local_add,mob,email,acd}=req.body;
  const userMarks= await ReportInfo.create({
    schoolName:school_name,
    AffiliationBoard:board_name,
    AffiliationNo:aff_no,
    Address:local_add,
    Phone:mob,
    email:email,
    Session:acd,
  })
  if(userMarks){
    res.redirect('/blueprint/ReportCard');
  }
  console.log(userMarks);
});

// Adminsidtrator Code
app.get('/admin/mainpage',adminAuth,(req,res)=>{
  res.render('adminModule.ejs');
});

// Route for admin Rehistration webpage.
app.get('/admin/registration/page',(req,res)=>{
  res.render('adminReg.ejs')
})
// Route for admin registration.
app.post('/admin/register',(req,res)=>{
  let{user_name,email,con_pass}=req.body;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(con_pass, salt, async function(err, hash) {
      let createdUser=await regAdminModel.create({
       username:user_name,
       email:email,
       password:hash,
       Secret_Key:SECRET_KEY,
      });
      console.log(createdUser);
    });
  });
  res.redirect('/success');
})

// Route for admin login
app.post('/login/admin',async(req,res)=>{
  let{sec_key}=req.body;
  let users= await regAdminModel.findOne({email: req.body.email});
  console.log(users);
  if(!users) res.send("Something went wrong");
  if(sec_key==users.Secret_Key){
    bcrypt.compare(req.body.pass,users.password,(err,result)=>{
      if(!result) res.redirect('/login');
      else {
        let tokenadmin=jwt.sign({email:users.email},jwtSecretKey);
        console.log(tokenadmin);
        res.cookie("tokenadmin",tokenadmin,{
          expires:new Date(Date.now()+1209600000),
          httpOnly:true
        });
        res.redirect('/admin/mainpage')
      } 
      console.log(result);
     });
  }
 else{
  res.redirect('/error')
 }
});

// Route for delete page.
app.get('/delete/page',adminAuth,(req,res)=>{
  res.render("deleteData.ejs")
})

// Route to delete data.
app.post('/delete',async(req,res)=>{
  let{enroll,aff_id}=req.body;
  // const marksheet = await marksModel.find({Enrollement: req.body.enroll});
  // const discipline= await disciplineModel.findOne({Enrollement:req.body.enroll});
  // const schoolData= await ReportInfo.findOne({AffiliationNo: req.body.aff_id});
  // condition
  const deleteRecord= await marksModel.deleteMany({Enrollement:{$in:enroll}});
  const deleteSchool= await ReportInfo.deleteMany({AffiliationNo:{$in:aff_id}})
  console.log(deleteRecord);
  console.log(deleteSchool);
  
  console.log("Marksheet sucessfully deleted");
  res.redirect("/success");
})
// Route to delete School data
app.post('/delete/schooldata',adminAuth, async(req, res) => {
  const deleteSchool= await ReportInfo.deleteMany({AffiliationNo:{$in:req.body.aff_id}})
})

// route for updatation security key page.
app.get('/security/update/keys',adminAuth,(req,res)=>{
  res.render('SecurityUpdate.ejs')
})

// route for updation
app.post('/update/result/securitykey',adminAuth,async(req,res)=>{
  let{old_res_key,new_res_key}=req.body;
  let updateResultSecurityKey= await disciplineModel.findOneAndUpdate({Security_key:old_res_key},
    {Security_key:new_res_key},{new:true});
    console.log(updateResultSecurityKey);
    res.redirect('/success'); 
})

app.post('/update/admin/securitykey',adminAuth,async(req,res)=>{
  let{admin_email,new_admin_key}=req.body;
  let updateAdminSecurityKey= await regAdminModel.findOneAndUpdate({email:admin_email},
    {Secret_Key:new_admin_key},{new:true});
    console.log(updateAdminSecurityKey); 
     res.redirect('/success'); 
})

// Upload School Logo
app.post('/logo/registration',upload.single('org_logo'),async(req,res)=>{
  console.log(req.file.path);
  const uploadSchoolLogo = await cloudinary.uploader
  .upload(
     req.file.path
  )
  .catch((error) => {
      console.log(error);
  });
  console.log(uploadSchoolLogo);
  //Delete file 
  fs.unlink(req.file.path,
    (err)=> {
        if (err) console.log(err);
        else {
            console.log("\nDeleted file");
        }
    });
    const SchoolLogo= await RegisterLogoModel.create({
      AffNo:req.body.aff_id,
      ImageId:uploadSchoolLogo.secure_url,
    })
    console.log("Student Registered Successfully!");
    console.log(SchoolLogo);
  res.redirect('/success');
})
app.get('/logout/admin',(req,res)=>{
  res.cookie("tokenadmin","")
  res.redirect('/admin/registration/page')
})
app.get('/logout/google',(req,res)=>{
req.session.destroy();
res.redirect('/')
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
module.exports = app;
