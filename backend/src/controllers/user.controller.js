import User from "../models/User.js";
import FriendRequest from "../models/friendRequest.js";


export const getRecommendedUsers = async(req, res) => {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                {_id: {$ne: currentUserId}},
                {_id: {$nin: currentUser.friends}},
                {isOnboarded : true}
            ]
        })
        res.status(200).json(recommendedUsers)
    } catch (error) {
        console.log(("Error in recommended controller"));
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getMyFriends = async(req,res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage")

            res.status(200).json(user.friends)

    } catch (error) {
        console.error("Error in getMyFriends controller", error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending request to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // block duplicates (pending)
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId, status: "pending" },
        { sender: recipientId, recipient: myId, status: "pending" },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "A pending friend request already exists between you and this user",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
      status: "pending",
    });

    return res.status(201).json({ success: true, friendRequest });
  } catch (error) {
    console.error("Error in sendFriendRequest Controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error in acceptFriendRequest controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getFriendRequests = async (req, res) => {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    return res.status(200).json({ incomingRequests, acceptedRequests });
  } catch (error) {
    console.error("Error in getFriendRequests controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getOutgoingRequests = async (req, res) => {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    return res.status(200).json(outgoingRequests);
  } catch (error) {
    console.error("Error in getOutgoingRequests controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}