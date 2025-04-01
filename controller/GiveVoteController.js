const Candidate = require('../models/candidate')
const User = require('../models/user')

// Start Voting
const GiveVoteController=async(req,res)=>{
// no admin can vote
// only user can vote once
let candidateId = req.params
let userId=req.body.id  //req.user.id
try {
    const candidate = await Candidate.findById(candidateId)
    if(!candidate){
        return res.status(404).send({
            success:false,
            message:"Candidate Not Found"
        })
    }
    const user= await User.findById(userId)
    if(!user){
        return res.status({
            success:"false",
            message:"User Not Found"
    })
    }

    if(user.isVoted){
  return res.status(400).send({
    message:"You have already Voted"
  })
    }
    if(user.role == 'admin'){
      return  res.status(403).send({
            message:"Admin is not allowed"
        })
    }

    // Update the candidate documents
    candidate.votes.push({user:userId})
    candidate.voteCount++;
    await candidate.save;

    //Update the user Document
    user.isVoted = true
    await user.save();

    res.status(200).send({
        message:"You Voted Successfully"
    })
    
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Internal Server Error"
    })
}
}

// Vote Count
const votecountController=async(req,res)=>{
try {
    const candidate = await Candidate.find().sort({voteCount:'desc'});

    const voterecord = candidate.map((data)=>{
        return{
            party: data.party,
            count: data.voteCount
        }
    })

    return res.status(200).send({
        message:"Vote Result is",
        voterecord
    })
    
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Internal Server Error"
    })
    
}
}



module.exports = {GiveVoteController,votecountController}