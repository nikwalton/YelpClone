import React from "react";

import { AnchorButton, Alignment, Navbar } from "@blueprintjs/core";

function NASA_NAV()
{
    return(
        <div>
            <Navbar>
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading>NASA Yelp &#128640;</Navbar.Heading>
                    <Navbar.Divider />
                    <AnchorButton 
                        className='bp4-minimal' 
                        icon='user' 
                        text="User Search"
                        href="/user"/>
                    <AnchorButton 
                        className='bp4-minimal' 
                        icon='shop' 
                        text="Business Search"
                        href="/business"/>
                </Navbar.Group>
            </Navbar>
        </div>
    );

}

export default NASA_NAV