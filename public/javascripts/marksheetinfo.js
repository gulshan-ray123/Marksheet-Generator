// creating function

function CalculateMarks(){
    let thoery= document.getElementById("theory_term1").value;
    let practicle= document.getElementById("prac_term1").value;
    let total =Number(thoery)+Number(practicle);
    Number(total);
    document.getElementById("ttl_mrk").value = total;
    console.log(total);
    // logic for grade
    if((total>90)&&(total<=100)){
        document.getElementById("grade").value="A+"
    }
    else if((total>80)&&(total<=90)){
        document.getElementById("grade").value="A"
    }
   else if((total>70)&&(total<=80)){
        document.getElementById("grade").value="B+"
    }
    else if((total>60)&&(total<=70)){
        document.getElementById("grade").value="B"
    }
    else if((total>50)&&(total<=60)){
        document.getElementById("grade").value="C+"
    }
    else if((total>40)&&(total<=50)){
        document.getElementById("grade").value="C"
    }
    else if((total>30)&&(total<=40)){
        document.getElementById("grade").value="D"
    }
    else{
         document.getElementById("grade").value="E"
    }
}
function claculateMarks_term2(){
    let thoery= document.getElementById("theory_term2").value;
    let practicle= document.getElementById("prac_term2").value;
    let total =Number(thoery)+Number(practicle);
    Number(total);
    document.getElementById("ttl_mrk2").value = total;
    console.log(total);
    // logic for grade
    if((total>90)&&(total<=100)){
        document.getElementById("grade2").value="A+"
    }
    else if((total>80)&&(total<=90)){
        document.getElementById("grade2").value="A"
    }
   else if((total>70)&&(total<=80)){
        document.getElementById("grade2").value="B+"
    }
    else if((total>60)&&(total<=70)){
        document.getElementById("grade2").value="B"
    }
    else if((total>50)&&(total<=60)){
        document.getElementById("grade2").value="C+"
    }
    else if((total>40)&&(total<=50)){
        document.getElementById("grade2").value="C"
    }
    else if((total>30)&&(total<=40)){
        document.getElementById("grade2").value="D"
    }
    else{
         document.getElementById("grade2").value="E"
    }
}

function Disciplinary(){
    let enrollement=document.getElementById("st_enroll").value;
    let affiliation= document.getElementById("st_aff").value;
    Number(enrollement);
    Number(affiliation);
    document.getElementById("enr_dis").value= enrollement;
    document.getElementById("aff_dis").value= affiliation;
}