import styled, { createGlobalStyle } from "styled-components";
import icon from "./assets/newPic.png";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f5f6f8; }
`;

const Page = styled.div`
  font-family: "Nunito", sans-serif;
  min-height: 100vh;
  background: #f5f6f8;
  color: #1f2937;
`;

const TopBar = styled.div`
  background: #fff;
  border-bottom: 1px solid #e9eaec;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 10;
  
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .dot {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #2e8b57, #3aab6a);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dot::after {
    color: white;
    font-size: 13px;
    font-weight: 800;
  }

  span {
    font-size: 15px;
    font-weight: 800;
    color: #1f2937;
    letter-spacing: -0.3px;
  }

  img {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(46, 139, 87, 0.2);
    }
`;

const BackLink = styled.a`
  font-size: 13px;
  font-weight: 600;
  color: #2e8b57;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover { text-decoration: underline; }
`;

const Hero = styled.div`
  background: #fff;
  border-bottom: 1px solid #e9eaec;
  padding: 48px 2rem 40px;
  text-align: center;

  .eyebrow {
    display: inline-block;
    background: #edf7f1;
    color: #2e8b57;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 16px;
  }

  h1 {
    font-size: 32px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.5px;
    margin-bottom: 10px;
  }

  p {
    font-size: 15px;
    color: #6b7280;
    font-weight: 500;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .meta {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    font-size: 12px;
    color: #9ca3af;
    font-weight: 600;
  }
`;

const Layout = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 2rem 80px;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.nav`
  position: sticky;
  top: 80px;

  @media (max-width: 700px) {
    display: none;
  }

  p {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  li a {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    text-decoration: none;
    padding: 6px 10px;
    border-radius: 8px;
    transition: all 0.15s;

    &:hover {
      background: #edf7f1;
      color: #2e8b57;
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Section = styled.div`
  background: #fff;
  border: 1px solid #e9eaec;
  border-radius: 14px;
  padding: 28px 32px;

  .section-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .section-num {
    width: 28px;
    height: 28px;
    background: #edf7f1;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 800;
    color: #2e8b57;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  h2 {
    font-size: 16px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.2px;
  }

  p {
    font-size: 14px;
    line-height: 1.75;
    color: #4b5563;
    font-weight: 500;
    margin-bottom: 10px;

    &:last-child { margin-bottom: 0; }
  }

  ul {
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin: 8px 0;
  }

  li {
    font-size: 14px;
    color: #4b5563;
    font-weight: 500;
    line-height: 1.6;
    display: flex;
    align-items: flex-start;
    gap: 8px;

    &::before {
      content: "";
      display: block;
      width: 6px;
      height: 6px;
      background: #3aab6a;
      border-radius: 50%;
      margin-top: 7px;
      flex-shrink: 0;
    }
  }
`;

const ContactCard = styled.div`
  background: linear-gradient(135deg, #2e8b57, #3aab6a);
  border-radius: 14px;
  padding: 28px 32px;
  color: white;
  margin-top: 8px;

  h3 {
    font-size: 17px;
    font-weight: 800;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    opacity: 0.9;
    font-weight: 500;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  a {
    display: inline-block;
    background: rgba(255,255,255,0.18);
    color: white;
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    padding: 8px 18px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.3);

    &:hover { background: rgba(255,255,255,0.28); }
  }
`;

const Footer = styled.footer`
  background: #fff;
  border-top: 1px solid #e9eaec;
  padding: 20px 2rem;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
`;

const sections = [
  {
    id: "collect",
    title: "Information We Collect",
    content: (
      <>
        <p>When you use Attendict, we collect the following to run the attendance service:</p>
        <ul>
          <li>Student name and index number</li>
          <li>Programme and level of study</li>
          <li>Device fingerprint and IP address (for session security)</li>
          <li>Location data — latitude and longitude, only during active sessions</li>
          <li>Check-in time and attendance status</li>
        </ul>
        <p>For lecturers, we collect your name, title, contact info, and email to manage your account.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "How We Use Your Information",
    content: (
      <>
        <p>We use your data solely to operate Attendict:</p>
        <ul>
          <li>To record and verify student attendance</li>
          <li>To detect duplicate or suspicious check-ins via device and IP data</li>
          <li>To generate attendance reports for lecturers</li>
          <li>To manage lecturer accounts and subscriptions</li>
          <li>To maintain session security and prevent unauthorized access</li>
        </ul>
      </>
    ),
  },
  {
    id: "location",
    title: "Location Data",
    content: (
      <p>
        Location is collected only during an active attendance session to verify
        that a student is within range of the lecturer. It is stored temporarily
        and used solely for distance validation. We do not track your location
        outside of an active session.
      </p>
    ),
  },
  {
    id: "storage",
    title: "Data Storage & Security",
    content: (
      <>
        <p>
          All data is stored on MongoDB Atlas with encrypted connections.
          Session tokens are short-lived and are tied to device
          fingerprints to prevent sharing or misuse.
        </p>
        <p>
          We use Redis for temporary session and location caching. Cached data
          expires automatically and is not retained beyond the session.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Data Sharing",
    content: (
      <p>
        We do not sell, trade, or share your personal information with third
        parties. Attendance data is accessible only to the lecturer who conducted
        the session. We do not share data with any external analytics or
        advertising services.
      </p>
    ),
  },
  {
    id: "retention",
    title: "Data Retention",
    content: (
      <p>
        Attendance records are kept for the duration of the academic semester or
        until the lecturer deletes the session. Lecturer accounts and course
        records are retained until the account is deleted. Session tokens expire
        automatically after 10 minutes of inactivity.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your Rights",
    content: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li>Request access to your attendance records from your lecturer</li>
          <li>Request deletion of your data by contacting us or your institution</li>
          <li>Opt out of location collection — note this may prevent successful check-in</li>
        </ul>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will
        appear on this page with an updated effective date. Continued use of
        Attendict after changes are posted means you accept the revised policy.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <>
      <GlobalStyle />
      <Page>
        <TopBar>
          <Brand>
              <img className="dot" src={icon} alt="Attendict logo" />
              <span>Attendict</span>
          </Brand>
          <BackLink href="/">← Back to app</BackLink>
        </TopBar>

        <Hero>
          <div className="eyebrow">Legal</div>
          <h1>Privacy Policy</h1>
          <p>How Attendict collects, uses, and protects your information.</p>
          <div className="meta">
            <span>📅 Effective: June 2026</span>
            <span>📄 8 sections</span>
          </div>
        </Hero>

        <Layout>
          <Sidebar>
            <p>On this page</p>
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
              <li><a href="#contact">Contact</a></li>
            </ul>
          </Sidebar>

          <Content>
            {sections.map((s, i) => (
              <Section key={s.id} id={s.id}>
                <div className="section-head">
                  <div className="section-num">{String(i + 1).padStart(2, "0")}</div>
                  <h2>{s.title}</h2>
                </div>
                {s.content}
              </Section>
            ))}

            <ContactCard id="contact">
              <h3>Questions or Concerns?</h3>
              <p>
                If you have any questions about this Privacy Policy or how your
                data is handled, we're happy to help.
              </p>
              <a href="mailto:support@attendict.com">support@attendict.com</a>
            </ContactCard>
          </Content>
        </Layout>

        <Footer>
          © {new Date().getFullYear()} Terox Inc. All rights reserved.
        </Footer>
      </Page>
    </>
  );
}
