import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from '../../Menu';


export function Navigation() {

  const [active, setActive] = useState("");

  const links = Menu.map((item) => {
    
    return <>
      <div className={"tools-nav-entry"}>
        <Link
          className={item.path === active ? "active" : "" }
          to={item.path}
          key={item.path}
          onClick={(event) => {        
            setActive(item.path);
          }}
        >
          {item.icon}
          <span>{item.displayName}</span>
        </Link>

        {item.children && item.children.map((subItem) => {

          return <>
            <div className={"tools-nav-subentry"}>
              <Link
                className={subItem.path === active ? "active" : "" }
                to={subItem.path}
                key={subItem.path}
                onClick={(event) => {        
                  setActive(subItem.path);
                }}
              >
                {subItem.icon}
                <span>{subItem.displayName}</span>
              </Link>
            </div>
          </>;

        })}
      </div>
    </>
  });

  return <>
    <div className={"tools-nav"}>
      {links}
      <hr/>
      <span>Tools</span><code>1.0.0</code>
    </div>
  </>;
}