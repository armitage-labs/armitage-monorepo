import { DriveStep } from "driver.js";

export const productTourData: DriveStep[] = [
  {
    popover: {
      title: "Welcome to Armitage!",
      description:
        "Thank you for trying Armitage! We are still a prototype but we hope you find it useful!",
      side: "left",
      align: "start",
    },
  },
  {
    popover: {
      title: "Let's get started",
      description:
        "To start measuring impact, you need to create a team and assign repositories to that specific team",
      side: "left",
      align: "start",
    },
  },
  {
    element: 'a[href="/repositories"]',
    popover: {
      title: "Repositories",
      description:
        "You can start analyzing a repository, by navigating to the repositories tab, where you are right now",
      side: "left",
      align: "start",
    },
  },
  {
    element: 'a[href="/teams"]',
    popover: {
      title: "Teams",
      description:
        "You can create a team on the Teams tab, by clicking the Add New button on the top right corner",
      side: "left",
      align: "start",
    },
  },
  {
    popover: {
      title: "Team details",
      description:
        "Analyzing a team impact can take a couple of minutes, so take a cup of tea and relax, after it finishes calculating, you can see the results on the team details page",
      side: "left",
      align: "start",
    },
  },
  {
    element: 'a[href="/contributors"]',
    popover: {
      title: "Contributors",
      description:
        "You can also see all engineers of all your teams on the Contributors page, with scores that compare their impact with all your other teams",
      side: "left",
      align: "start",
    },
  },
  {
    popover: {
      title: "Get to the impact!",
      description: "And that is all, go ahead and start having fun!",
    },
  },
];
