import React from "react";
import Link from "next/link";

const Nav = () => {
    return (
        <p>
            <Link className="text-[#4B70F5]" href='/'>Home </Link>
            <span>/ </span>
            <Link className="text-[#4B70F5]" href='/travel'>Travel </Link>
            <span>/ </span>
            Check Out
        </p>
    )
}

export default Nav;