import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import MyButton from "../components/MyButton";
import { IExperiment, ABTestProvider } from "ab-testing-hook";

enum Devices {
  Desktop = 'desktop',
  Mobile = 'mobile',
  Tablet = 'tablet'
}

enum Statuses {
  Active = 'active',
  Inactive = 'inactive',
  Paused = 'paused'
}

interface MyExperiment extends IExperiment {
  status: Statuses,
  devices: Devices[]
}

interface IProps {
  userId: string
  experiments: MyExperiment[]
}

const Home: NextPage<IProps> = ({ userId, experiments }) => {
  return (
    <ABTestProvider userId={userId} experiments={experiments} debugMode={process.env.NODE_ENV === 'development'}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-screen-xl flex flex-col w-full mx-auto p-14">
        <div className="text-lg text-slate-800 mb-4">Your userid: <span className="font-medium">{userId}</span>. Reload page to chage</div>
        <div className="flex flex-start">
          <MyButton />
        </div>
      </div>
    </ABTestProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // from cookie get user identifier if dont have generate and set
  const userId = uuidv4();
  // from backend get experiments
  const experiments = [
    {
      name: 'new_beatiful_design',
      groups: [
        {
          name: 'variantA',
          weight: 0.2, // 20%
        },
        {
          name: 'variantB',
          weight: 0.8, // 80%
        },
      ],
      traffic_percent: [0, 0.2], // 20%
    },
    {
      name: 'new_button',
      groups: [
        {
          name: 'variantA',
          weight: 0.4, // 40%
        },
        {
          name: 'variantB',
          weight: 0.6, // 60%,
        },
      ],
      trafficPercentRange: [0.2, 0.7], // 50%
    },
  ];

  return { props: { userId, experiments } }
}

export default Home;
