"use client";

import React from "react";
import { Button } from "../ui/button";

type LogoutButtonProps = {
  logout: () => void;
};

function LogoutButton({ logout }: LogoutButtonProps) {
  return (
    <form action={logout}>
      <Button variant={"tertiary"}>Logout</Button>
    </form>
  );
}

export default LogoutButton;