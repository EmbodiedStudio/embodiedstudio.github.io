export const studyData = {
  "abstract": "Training and evaluating robots across diverse tasks requires a supply of simulation environments suited to those tasks. While recent scene and task generators offer a promising way to expand this supply, delivering a usable task environment still faces two practical gaps: generated scenes that look plausible in appearance often fail to support the intended task interactions or remain physically stable in simulation, and generated scoring programs frequently attempt task conditions without implementing them faithfully. We present EmbodiedStudio, a task-driven simulation generation platform that bridges these gaps by jointly authoring scene, task, robot-behavior, and rubric programs under closed-loop simulation feedback and independent review. Crucially, as the coding agent iteratively debugs scenes, behaviors, and stateful rubrics in simulation, this closed-loop process natively yields both forward construction experience for learning to build environments and physical execution experience for policy learning, all bound to frozen environment revisions for repeatable evaluation. Across scene generation, rubric evaluation, ablations, and learning studies, EmbodiedStudio substantially improves task readiness and rubric faithfulness while improving physical stability and retaining actionable supervision signals for layout authoring and policy adaptation.",
  "scene": [
    [
      "Holodeck",
      23.19,
      11.38,
      77.36,
      60.76,
      1.68
    ],
    [
      "LayoutVLM",
      51.93,
      22.88,
      73.74,
      43.6,
      2.35
    ],
    [
      "SAGE",
      59.55,
      44.8,
      86.08,
      62.68,
      2.59
    ],
    [
      "EmbodiedGen V2",
      26.66,
      4.23,
      80.34,
      72.71,
      2.31
    ],
    [
      "SceneSmith",
      74.26,
      69.25,
      90.86,
      71.19,
      2.77
    ],
    [
      "EmbodiedStudio (Full)",
      97.63,
      98.36,
      99.07,
      79.84,
      2.95
    ],
    [
      "w/o simulation-feedback revision",
      96.9,
      97.39,
      99.1,
      60.38,
      2.81
    ],
    [
      "w/o independent review",
      98.04,
      98.0,
      97.64,
      59.35,
      2.91
    ]
  ],
  "rubric": [
    [
      "GenSim",
      71.97,
      38.01,
      73.53,
      75.49,
      20.59,
      32.35,
      52.5
    ],
    [
      "RoboGen",
      93.67,
      62.65,
      50.0,
      66.67,
      0.0,
      100.0,
      27.5
    ],
    [
      "RoboLab",
      94.25,
      56.85,
      73.13,
      80.0,
      6.25,
      47.5,
      60.0
    ],
    [
      "EmbodiedStudio",
      96.25,
      92.39,
      82.5,
      88.24,
      0.0,
      35.0,
      83.75
    ]
  ],
  "policyAdaptation": {
    "checkpoint": "π₀.₅ (LoRA · 30 demos / task · 5 held-out rollouts)",
    "rows": [
      {
        "id": "apple",
        "name": ["苹果摆放", "Apple placement"],
        "before": 0.0,
        "after": 32.0
      },
      {
        "id": "blocks",
        "name": ["双层积木搭建", "Two-level blocks"],
        "before": 0.0,
        "after": 35.09
      },
      {
        "id": "mean",
        "name": ["两任务均值", "Mean across tasks"],
        "before": 0.0,
        "after": 33.55
      }
    ]
  },
  "learningMeta": {
    "T04": {
      "title": ["(a) 叠碗目标区域", "(a) Bowl-stacking area"],
      "note": ["微调后清晰构建出标注的叠碗操作区", "Clearly forms the marked bowl-stacking area"]
    },
    "M09": {
      "title": ["(b) 书桌与座椅学习角", "(b) Study corner"],
      "note": ["微调后书桌与座椅形成连贯可用的学习角", "Desk and chair align into a coherent study corner"]
    },
    "R09": {
      "title": ["(c) 沙发与茶几间距", "(c) Sofa & coffee table"],
      "note": ["微调后沙发与茶几保持清晰可通行间距", "Sofa and coffee table separate cleanly with clearance"]
    },
    "R12": {
      "title": ["(d) 衣柜贴墙对齐", "(d) Wardrobe placement"],
      "note": ["微调后衣柜稳固贴合远端墙面摆放", "Wardrobe sits flush against the far wall"]
    }
  },
  "replay": {
    "task": "T07",
    "episode": "8ece6208e1514ff2",
    "revision": "08fb8a1095962b27a501c01b",
    "seconds": 156.45,
    "cycles": 3129,
    "reportSha256": "5cce54d739d0d414c24a076a6e5fbaa72d65c2280e5d4377ff2ebded7b11a07c",
    "transitionsSha256": "8791831934401435c81544bdf6f881d28c24e475aec6f3f2a5d792482f7c84d1",
    "events": [
      [
        0,
        0.0,
        false,
        "initial",
        false,
        true
      ],
      [
        24.1,
        0.0,
        false,
        "initial",
        false,
        false
      ],
      [
        25.9,
        0.0,
        false,
        "initial",
        false,
        true
      ],
      [
        43.05,
        0.0,
        false,
        "initial",
        false,
        false
      ],
      [
        57.7,
        0.25,
        false,
        "opened",
        false,
        false
      ],
      [
        128.3,
        0.7,
        false,
        "inserted",
        true,
        false
      ],
      [
        156.1,
        0.7,
        false,
        "inserted",
        true,
        true
      ],
      [
        156.45,
        1.0,
        true,
        "complete",
        true,
        true
      ]
    ]
  },
  "requests": {
    "tabletop": "Generate a realistic, simulation-ready scene in the initial state BEFORE the task below begins. Create the environment, not a depiction of the completed task. Include the objects and functional interactions needed for the task, with plausible scale, materials, collision geometry, and support. Objects that must be picked up or moved must be separate movable objects. Required openings and moving parts must be usable rather than fixed decorative geometry. Choose the layout, dimensions, object models, and visual style freely, subject to the task requirements. Leave practical access, manipulation clearance, and any necessary travel routes. Do not execute the task or generate a robot trajectory; a robot model is not required.\n\nScope: One tabletop workspace. All task objects and destinations belong to this workspace; travel between room locations is not required. Provide a coherent supporting setting without expanding the task to an entire room.\n\nTask: Move the three designated objects from the tray into the storage box, leaving the non-target objects on the tray.\n\nInitial state and required interactions: The tray initially contains three clearly designated target objects and a few distinguishable distractors. Define the targets with visible labels or simple unambiguous attributes. The receiving box starts empty and open, with an interior large enough for all three targets.",
    "kitchen": "Generate a realistic, simulation-ready scene in the initial state BEFORE the task below begins. Create the environment, not a depiction of the completed task. Include the objects and functional interactions needed for the task, with plausible scale, materials, collision geometry, and support. Objects that must be picked up or moved must be separate movable objects. Required openings and moving parts must be usable rather than fixed decorative geometry. Choose the layout, dimensions, object models, and visual style freely, subject to the task requirements. Leave practical access, manipulation clearance, and any necessary travel routes. Do not execute the task or generate a robot trajectory; a robot model is not required.\n\nScope: One complete, coherently furnished room of the stated type. Include the room enclosure and appropriate everyday furnishings. The named source and destination furniture or work areas must be distinct locations within that room; choose their arrangement freely.\n\nTask: Move the plates and cups from the dish-drying rack into their designated storage areas in the dish cabinet.\n\nInitial state and required interactions: Create a kitchen with plates and cups initially on a drying rack and available storage space in a separate dish cabinet. Make the plate and cup destinations distinguishable. If doors enclose the storage areas, they must be operable. Rack slots, cabinet openings, and shelves must accommodate the tableware.",
    "multiroom": "Generate a realistic, simulation-ready scene in the initial state BEFORE the task below begins. Create the environment, not a depiction of the completed task. Include the objects and functional interactions needed for the task, with plausible scale, materials, collision geometry, and support. Objects that must be picked up or moved must be separate movable objects. Required openings and moving parts must be usable rather than fixed decorative geometry. Choose the layout, dimensions, object models, and visual style freely, subject to the task requirements. Leave practical access, manipulation clearance, and any necessary travel routes. Do not execute the task or generate a robot trajectory; a robot model is not required.\n\nScope: A coherent home environment containing the distinct functional rooms or spaces named below, connected by usable doorways or passages. Keep task origins and destinations in their specified spaces. Do not collapse a cross-room task into one room. Choose the floor plan freely; multiple floors are not required.\n\nTask: Carry the empty tableware from the dining room to the kitchen sink and put the sealed food containers into the refrigerator.\n\nInitial state and required interactions: Include a dining room and a kitchen. Empty plates and cups and sealed rigid food containers initially rest on the dining table. Provide a usable kitchen sink basin and an initially closed refrigerator with an operable door and enough storage space. Washing, cooling, and food deformation are not required."
  }
};
