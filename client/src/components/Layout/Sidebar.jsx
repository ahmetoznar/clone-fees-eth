import { useTransition, animated } from "react-spring";
import Link from "next/link";
export default function Sidebar({ sidebarData, links }) {
  const transition = useTransition(sidebarData.isSidebar, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  return (
    <>
      {transition((style, renderer) => (
        <animated.div style={style}>
          {renderer && (
            <>
              <div className="overlay"></div>
              <div className="sidebar">
                <div className="sidebar-row">
                  <div className="sidebar-header">
                    <img
                      style={{
                        width: 200,
                        height: "auto",
                      }}
                      src="/images/oct-logo.png"
                      alt=""
                    />
                    <button
                      onClick={() => sidebarData.setIsSidebar(false)}
                      className="dark"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="sidebar-body pt-4">
                    <ul
                      style={{
                        display: "flex",
                        gap: 12,
                        flexDirection: "column",
                      }}
                    >
                      {links.map((link, idx) => (
                        <Link href={link.to}>
                          <a>
                            <li key={idx}>
                              <h5>{link.title}</h5>
                            </li>
                          </a>
                        </Link>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </animated.div>
      ))}
    </>
  );
}
