"use client";

import { useState } from "react";
import VotingControl from "@/components/admin/VotingControl/VotingControl";

export default function VotingPage() {
  const [votingOpenEventHall, setVotingOpenEventHall] = useState(false);
  const [votingOpenHome, setVotingOpenHome] = useState(false);
    
  return (
    <VotingControl
      votingOpenEventHall={votingOpenEventHall}
      setVotingOpenEventHall={setVotingOpenEventHall}
      votingOpenHome={votingOpenHome}
      setVotingOpenHome={setVotingOpenHome}
    />
  );
}
