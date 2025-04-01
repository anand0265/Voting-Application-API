const Candidate = require('../models/candidate')



const AddCandidateController=async(req,res)=>{

    try {
        const data = req.body

        const newCandidate = await Candidate(data);
        await newCandidate.save();

        res.status(200).send({
            success:true,
            message:"Candiodate Added Successfully",
            newCandidate
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Create Candidate API"
        })
    }
}


const UpdateCandidateController = async (req, res) => {
    try {
        const { id } = req.params;   // Get candidate ID from params
        const data = req.body;       // Get update data from request body

        // Find and update the candidate by ID
        const updatedCandidate = await Candidate.findByIdAndUpdate(
            id, 
            data, 
            { new: true }  // Return the updated document
        );

        // Check if candidate exists
        if (!updatedCandidate) {
            return res.status(404).send({
                success: false,
                message: "Candidate not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Candidate updated successfully",
            updatedCandidate
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Update Candidate API",
            error: error.message
        });
    }
};

const DeleteCandidateController = async (req, res) => {
    try {
        const { id } = req.params;   // Get candidate ID from params

        // Find and delete the candidate by ID
        const deletedCandidate = await Candidate.findByIdAndDelete(id);

        // Check if candidate exists
        if (!deletedCandidate) {
            return res.status(404).send({
                success: false,
                message: "Candidate not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Candidate deleted successfully",
            deletedCandidate
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Delete Candidate API",
            error: error.message
        });
    }
};

const ListofCandidateController = async(req,res)=>{
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await Candidate.find({}, 'name party -_id');

        // Return the list of candidates
        res.status(200).send({
            message:"List of Candidaate",
            candidates
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {AddCandidateController, UpdateCandidateController, DeleteCandidateController, ListofCandidateController}