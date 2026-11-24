export const corpus = {
  "scenes": [
    {
      "id": "T11",
      "name": [
        "桌面目标物体挑选",
        "Tabletop object selection"
      ],
      "scale": "tabletop",
      "group": "main",
      "views": [
        {
          "name": [
            "工作区细节",
            "Workspace detail"
          ],
          "src": "./media/corpus/T11-studio.webp",
          "angle": "detail"
        },
        {
          "name": [
            "场景渲染",
            "Scene render"
          ],
          "src": "./media/corpus/T11.webp",
          "angle": "overview"
        }
      ],
      "revision": "58d04bb6d233510a2afa5bcb",
      "request": "Generate a realistic, simulation-ready scene in the initial state BEFORE the task below begins. Create the environment, not a depiction of the completed task. Include the objects and functional interactions needed for the task, with plausible scale, materials, collision geometry, and support. Objects that must be picked up or moved must be separate movable objects. Required openings and moving parts must be usable rather than fixed decorative geometry. Choose the layout, dimensions, object models, and visual style freely, subject to the task requirements. Leave practical access, manipulation clearance, and any necessary travel routes. Do not execute the task or generate a robot trajectory; a robot model is not required.\n\nScope: One tabletop workspace. All task objects and destinations belong to this workspace; travel between room locations is not required. Provide a coherent supporting setting without expanding the task to an entire room.\n\nTask: Move the three designated objects from the tray into the storage box, leaving the non-target objects on the tray.\n\nInitial state and required interactions: The tray initially contains three clearly designated target objects and a few distinguishable distractors. Define the targets with visible labels or simple unambiguous attributes. The receiving box starts empty and open, with an interior large enough for all three targets.",
      "model": "./media/corpus/T11.glb",
      "featured": true
    },
    {
      "id": "R02",
      "name": [
        "厨房餐具归位收纳",
        "Kitchen dish storage"
      ],
      "scale": "room",
      "group": "main",
      "views": [
        {
          "name": [
            "场景渲染",
            "Scene render"
          ],
          "src": "./media/corpus/R02.webp",
          "angle": "overview"
        },
        {
          "name": [
            "室内特写",
            "Interior close-up"
          ],
          "src": "./media/corpus/R02-interior.webp",
          "angle": "interior"
        }
      ],
      "revision": "fa9f02865a960507dee39f8d",
      "request": "Generate a realistic, simulation-ready scene in the initial state BEFORE the task below begins. Create the environment, not a depiction of the completed task. Include the objects and functional interactions needed for the task, with plausible scale, materials, collision geometry, and support. Objects that must be picked up or moved must be separate movable objects. Required openings and moving parts must be usable rather than fixed decorative geometry. Choose the layout, dimensions, object models, and visual style freely, subject to the task requirements. Leave practical access, manipulation clearance, and any necessary travel routes. Do not execute the task or generate a robot trajectory; a robot model is not required.\n\nScope: One complete, coherently furnished room of the stated type. Include the room enclosure and appropriate everyday furnishings. The named source and destination furniture or work areas must be distinct locations within that room; choose their arrangement freely.\n\nTask: Move the plates and cups from the dish-drying rack into their designated storage areas in the dish cabinet.\n\nInitial state and required interactions: Create a kitchen with plates and cups initially on a drying rack and available storage space in a separate dish cabinet. Make the plate and cup destinations distinguishable. If doors enclose the storage areas, they must be operable. Rack slots, cabinet openings, and shelves must accommodate the tableware.",
      "model": "./media/corpus/R02.glb",
      "enclosure": [
        "floor",
        "north_wall",
        "east_wall",
        "south_left",
        "south_right",
        "entry_lintel",
        "west_low",
        "west_high",
        "west_front",
        "west_back",
        "ceiling"
      ],
      "featured": true
    },
    {
      "id": "M02",
      "name": [
        "跨房间餐桌清理与冷藏",
        "Dining-to-kitchen clearing"
      ],
      "scale": "multi",
      "group": "main",
      "views": [
        {
          "name": [
            "场景渲染",
            "Scene render"
          ],
          "src": "./media/corpus/M02.webp",
          "angle": "overview"
        }
      ],
      "revision": "d44b6a5661bce1f1d08c1491",
      "request": "Generate a realistic, simulation-ready scene in the initial state BEFORE the task below begins. Create the environment, not a depiction of the completed task. Include the objects and functional interactions needed for the task, with plausible scale, materials, collision geometry, and support. Objects that must be picked up or moved must be separate movable objects. Required openings and moving parts must be usable rather than fixed decorative geometry. Choose the layout, dimensions, object models, and visual style freely, subject to the task requirements. Leave practical access, manipulation clearance, and any necessary travel routes. Do not execute the task or generate a robot trajectory; a robot model is not required.\n\nScope: A coherent home environment containing the distinct functional rooms or spaces named below, connected by usable doorways or passages. Keep task origins and destinations in their specified spaces. Do not collapse a cross-room task into one room. Choose the floor plan freely; multiple floors are not required.\n\nTask: Carry the empty tableware from the dining room to the kitchen sink and put the sealed food containers into the refrigerator.\n\nInitial state and required interactions: Include a dining room and a kitchen. Empty plates and cups and sealed rigid food containers initially rest on the dining table. Provide a usable kitchen sink basin and an initially closed refrigerator with an operable door and enough storage space. Washing, cooling, and food deformation are not required.",
      "model": "./media/corpus/M02.glb",
      "enclosure": [
        "dining_floor",
        "kitchen_floor",
        "south_left",
        "south_right",
        "entry_header",
        "east",
        "north",
        "north_upper",
        "north_pier_left",
        "north_pier_middle",
        "north_pier_right",
        "west",
        "partition_south",
        "partition_north",
        "passage_header",
        "ceiling"
      ],
      "featured": true
    },
    {
      "id": "T01",
      "name": [
        "桌面苹果端放",
        "Apple placement"
      ],
      "scale": "tabletop",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/T01-studio.webp",
          "angle": "overview"
        }
      ],
      "revision": "2e9efb7b1dce136c66190b79",
      "request": "Move the designated apple into the empty bowl while leaving the other objects undisturbed.",
      "model": "./media/corpus/T01.glb",
      "featured": true
    },
    {
      "id": "R14",
      "name": [
        "卧室床头物品整理",
        "Bedside organization"
      ],
      "scale": "room",
      "group": "appendix",
      "views": [
        {
          "name": [
            "室内视角",
            "Interior view"
          ],
          "src": "./media/corpus/R14-studio.webp",
          "angle": "interior"
        }
      ],
      "revision": "cb74755a9d6ee9175fda5ad3",
      "request": "Organize the requested bedside items in the bedroom.",
      "model": "./media/corpus/R14.glb",
      "enclosure": [
        "floor",
        "north_wall",
        "east_wall",
        "west_back",
        "west_front",
        "west_sill_wall",
        "west_header",
        "south_left",
        "south_right",
        "entrance_header",
        "ceiling"
      ]
    },
    {
      "id": "M01",
      "name": [
        "跨房间双人餐桌摆盘",
        "Table setting for two"
      ],
      "scale": "multi",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/M01-studio.webp",
          "angle": "overview"
        },
        {
          "name": [
            "场景渲染",
            "Scene render"
          ],
          "src": "./media/corpus/M01.webp",
          "angle": "interior"
        }
      ],
      "revision": "d53aca956826a3aa732c411c",
      "request": "Set the dining table for two using the requested tableware in the connected kitchen and dining environment.",
      "model": "./media/corpus/M01.glb",
      "enclosure": [
        "floor",
        "west_wall",
        "east_wall",
        "south_left",
        "south_right",
        "entry_lintel",
        "north_lower",
        "north_upper",
        "north_pier_left",
        "north_pier_middle",
        "north_pier_right",
        "ceiling",
        "partition_north",
        "partition_south",
        "passage_lintel"
      ],
      "featured": true
    },
    {
      "id": "T03",
      "name": [
        "单人餐具摆放",
        "Set a place for one person"
      ],
      "scale": "tabletop",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景渲染",
            "Scene render"
          ],
          "src": "./media/corpus/T03.webp",
          "angle": "detail"
        }
      ]
    },
    {
      "id": "T06",
      "name": [
        "把杯子挂到架上",
        "Hang a mug on a rack"
      ],
      "scale": "tabletop",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/T06-overview.webp",
          "sourceSha256": "1d4b55e86c793dd139c7f69d23cd5e637f85310bafdac9c30263edce6d37057f",
          "renderSha256": "c561c16d5339f082a7f75ddfe3424ec8006e1205735ab42061be6ff2a25fe56b",
          "angle": "overview"
        }
      ],
      "featured": true
    },
    {
      "id": "R04",
      "name": [
        "收集烘焙用具",
        "Gather baking utensils"
      ],
      "scale": "room",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景渲染",
            "Scene render"
          ],
          "src": "./media/corpus/R04.webp",
          "angle": "overview"
        }
      ],
      "featured": true
    },
    {
      "id": "R11",
      "name": [
        "把盆栽移到窗边",
        "Move a potted plant to a window-side cabinet"
      ],
      "scale": "room",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/R11-overview.webp",
          "sourceSha256": "2721a36af6f9a9f1a1130da9cffccd098bd2530bf7566ee090d73b0e1513838e",
          "renderSha256": "3ad0f64c19a21c1b27eaaeac7acbb05037dc13c513bbc2a9ad6eb4657ec90a58",
          "angle": "overview"
        }
      ],
      "featured": true
    },
    {
      "id": "M04",
      "name": [
        "收纳入口处的杂货",
        "Put away groceries from the entrance"
      ],
      "scale": "multi",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/M04-overview.webp",
          "sourceSha256": "398e1dbee1816396b47f0f8e0bda00536ec066db5e75d0430a37de36625079c8",
          "renderSha256": "1a3c32559c867ee582e20070453089a014797b18bf17a97ccd0adb6946860971",
          "angle": "overview"
        }
      ],
      "featured": true
    },
    {
      "id": "M06",
      "name": [
        "从储物间给浴室补货",
        "Restock the bathroom from storage"
      ],
      "scale": "multi",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/M06-overview.webp",
          "sourceSha256": "2d5da08dfbb995c83520ed808022d4f413cc06da024ab88f43e0447bbc008fbf",
          "renderSha256": "bdb33cc1addd13c81b8aa410336f39b5ad701c327837b64ed4511c4968b9967a",
          "angle": "overview"
        }
      ],
      "featured": true
    },
    {
      "id": "T08",
      "name": [
        "从小柜中取杯",
        "Retrieve a cup from a small cabinet"
      ],
      "scale": "tabletop",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/T08-overview.webp",
          "sourceSha256": "c73b538ced425e681fa87945cc4b635f472e883aeeddede5f1544ce675d4499f",
          "renderSha256": "f2dd3b163545e4cc45aa10a8a71c249e133dd175ce5c4c8e5e2278b88357243b",
          "angle": "overview"
        }
      ],
      "featured": true
    },
    {
      "id": "T13",
      "name": [
        "用厨房夹转移物体",
        "Transfer objects using kitchen tongs"
      ],
      "scale": "tabletop",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/T13-overview.webp",
          "sourceSha256": "9453588ec298cc4824bf23cec1894260d7d5020d8365346ec0470f25524a367a",
          "renderSha256": "ad8786ccb027fc25af36f1732124f7330cf21e63465f072ed61d3a81d31e83aa",
          "angle": "overview"
        }
      ],
      "featured": true
    },
    {
      "id": "R13",
      "name": [
        "挂起空衣架",
        "Hang empty clothes hangers"
      ],
      "scale": "room",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/R13-overview.webp",
          "sourceSha256": "36840c1bfb8c5a1dcbfa3371a7c432a2220f4cd96a0a9723d865cc679af3bdec",
          "renderSha256": "be1460f76a8103ef12b13419d670743dbe31003895691556dacf70d3464eac9e",
          "angle": "overview"
        }
      ],
      "featured": true
    },
    {
      "id": "R19",
      "name": [
        "收纳洗衣房用品",
        "Store laundry-room supplies"
      ],
      "scale": "room",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景渲染",
            "Scene render"
          ],
          "src": "./media/corpus/R19.webp",
          "angle": "overview"
        },
        {
          "name": [
            "室内特写",
            "Interior close-up"
          ],
          "src": "./media/corpus/R19-interior.webp",
          "angle": "interior"
        }
      ],
      "featured": true
    },
    {
      "id": "M08",
      "name": [
        "取工具、清扫并归还",
        "Fetch tools, sweep, and return them"
      ],
      "scale": "multi",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/M08-overview.webp",
          "sourceSha256": "b616fbdde78d3808113155d65f27a383f64cbf6db39568cb910960656ba0fddb",
          "renderSha256": "1d1f06f500f42eaf8410926ba9e50598edbb0d11d03ca94916c6ff2087a90b3e",
          "angle": "overview"
        }
      ],
      "featured": true
    },
    {
      "id": "M09",
      "name": [
        "准备出门用品",
        "Pack items for leaving home"
      ],
      "scale": "multi",
      "group": "appendix",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/M09-overview.webp",
          "sourceSha256": "a4d93440f04ba0e907403b09b1826580e303f618b2b262f9f29a714d0f3dcb02",
          "renderSha256": "89cf7c76c45f8620818238b530afb5a8db3a463cc04637e33d68034972e5447c",
          "angle": "overview"
        }
      ],
      "featured": true
    },
    {
      "id": "R18",
      "name": [
        "浴室洗手台与收纳",
        "Bathroom washbasin and storage"
      ],
      "scale": "room",
      "group": "detail",
      "views": [
        {
          "name": [
            "场景渲染",
            "Scene render"
          ],
          "src": "./media/corpus/R18.webp",
          "angle": "interior"
        }
      ]
    },
    {
      "id": "R20",
      "name": [
        "杂物间工作区",
        "Utility room tools and packing area"
      ],
      "scale": "room",
      "group": "detail",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/R20-studio.webp",
          "angle": "overview"
        },
        {
          "name": [
            "场景渲染",
            "Scene render"
          ],
          "src": "./media/corpus/R20.webp",
          "angle": "interior"
        }
      ],
      "featured": true
    },
    {
      "id": "R08",
      "name": [
        "客厅玩具收纳区",
        "Living room toys, seating and storage"
      ],
      "scale": "room",
      "group": "detail",
      "views": [
        {
          "name": [
            "场景全景",
            "Scene overview"
          ],
          "src": "./media/corpus/R08-overview.webp",
          "sourceSha256": "faff461de560f961bf5cbcc5559fde2418eb8be3e1ee9a2ac1c67aa096702ffd",
          "renderSha256": "6b306603c237e2095bfcdb119220a95d76580a6550cbb23dcf9c56f53398abf4",
          "angle": "overview"
        }
      ],
      "featured": true
    },
    {
      "id": "method-kitchen",
      "name": [
        "Unitree G1 厨房",
        "Unitree G1 kitchen"
      ],
      "scale": "room",
      "group": "method",
      "views": [
        {
          "name": [
            "场景渲染",
            "Scene render"
          ],
          "src": "./media/corpus/G1-kitchen.webp",
          "angle": "interior"
        }
      ],
      "revision": "c7e4e1ca54c24efb0eb1ca1a",
      "request": "Pick food from the island, carry it through the left aisle, place it in the refrigerator, and close the door.",
      "model": "./media/corpus/method-kitchen.glb",
      "enclosure": [
        "floor",
        "ceiling",
        "back_wall",
        "right_wall",
        "front_left",
        "front_right",
        "front_lintel",
        "left_below_window",
        "left_above_window",
        "left_front_pier",
        "left_back_pier"
      ]
    }
  ],
  "videos": [
    {
      "id": "T01",
      "name": [
        "摆放苹果",
        "Apple placement"
      ],
      "robot": "Franka Panda",
      "seconds": 30.4,
      "reward": 1.0,
      "episode": "e41474606cfb415c",
      "revision": "3dee99611ea8485c08e3407d",
      "video": "./media/corpus/T01-episode.mp4",
      "poster": "./media/corpus/T01-poster.webp",
      "scoring": {
        "cycles": 608,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            16.6,
            0.2,
            false
          ],
          [
            26.65,
            0.5,
            false
          ],
          [
            26.7,
            0.2,
            false
          ],
          [
            30.4,
            1.0,
            true
          ]
        ],
        "transitionsSha256": "2cf243125ee1512095bc8b366ba20d16e1f9695b6a3c0597c0c4c6190c582328"
      },
      "featured": true,
      "group": "tabletop"
    },
    {
      "id": "T07",
      "name": [
        "把笔放进抽屉",
        "Drawer storage"
      ],
      "robot": "Franka Panda",
      "seconds": 156.45,
      "reward": 1.0,
      "episode": "8ece6208e1514ff2",
      "revision": "08fb8a1095962b27a501c01b",
      "video": "./media/corpus/T07-episode.mp4",
      "poster": "./media/corpus/T07-poster.webp",
      "featured": true,
      "group": "tabletop"
    },
    {
      "id": "T15",
      "name": [
        "积木搭建",
        "Block building"
      ],
      "robot": null,
      "seconds": 45.1,
      "reward": 1.0,
      "episode": "fb756def61964e2e",
      "revision": "6c6839e60468c89515ac8f01",
      "video": "./media/corpus/T15-episode.mp4",
      "poster": "./media/corpus/T15-poster.webp",
      "scoring": {
        "cycles": 902,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            29.85,
            0.6,
            false
          ],
          [
            43.55,
            0.0,
            false
          ],
          [
            44.75,
            0.6,
            false
          ],
          [
            45.1,
            1.0,
            true
          ]
        ],
        "transitionsSha256": "30dac8afb1cbbe1781d184bec3e09565673ba28f756910c9c9113577e9f3c493",
        "rubricVersion": "t15-process-score-v1-bbde910480ffd6ef1d45cc3b",
        "rubricSha256": "93d8b277b0639386cde8a1f4eaf4ffd660ad368cf8384c82eaa1650229e2b57b"
      },
      "featured": true,
      "group": "tabletop"
    },
    {
      "id": "T16",
      "name": [
        "把物品装进箱子",
        "Box packing"
      ],
      "robot": "Aloha-AgileX",
      "seconds": 18.6,
      "reward": 1.0,
      "episode": "ffab74ecbe9a46e2",
      "revision": "a2aa33364a7ad6e7edb8cf62",
      "video": "./media/corpus/T16-episode.mp4",
      "poster": "./media/corpus/T16-poster.webp",
      "scoring": {
        "cycles": 558,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            1.9,
            0.2,
            false
          ],
          [
            6.933333,
            0.4,
            false
          ],
          [
            11.333333,
            0.6,
            false
          ],
          [
            16.2,
            0.8,
            false
          ],
          [
            18.6,
            1.0,
            true
          ]
        ],
        "transitionsSha256": "999a7d6b9ea713c485a50b71aa5e8f42b10647a4c6785789a0d566b87eb17d50"
      },
      "featured": true,
      "group": "tabletop"
    },
    {
      "id": "R10",
      "name": [
        "清出客厅通道",
        "Passage clearing"
      ],
      "robot": "Fetch",
      "seconds": 72.3,
      "reward": 1.0,
      "episode": "b34b662288134f4a",
      "revision": "68bcbad167c87750f9bb4998",
      "video": "./media/corpus/R10-episode.mp4",
      "poster": "./media/corpus/R10-poster.webp",
      "scoring": {
        "cycles": 1446,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            72.3,
            1.0,
            true
          ]
        ],
        "transitionsSha256": "f5f0139270d77fea69fde91bcf663c6b2fdc0ee95d2cfa0fb07d3bd655895d2e"
      },
      "featured": true,
      "group": "room"
    },
    {
      "id": "R18",
      "name": [
        "清理浴室空包装",
        "Bathroom litter removal"
      ],
      "robot": "Galaxea R1 Pro",
      "seconds": 26.8,
      "reward": 1.0,
      "episode": "197f1e687ac04d3f",
      "revision": "30ffe27824b5ff8859f2b9c4",
      "video": "./media/corpus/R18-episode.mp4",
      "poster": "./media/corpus/R18-poster.webp",
      "scoring": {
        "cycles": 268,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            25.5,
            0.5,
            false
          ],
          [
            26.1,
            1.0,
            false
          ],
          [
            26.8,
            1.0,
            true
          ]
        ],
        "transitionsSha256": "282412b3553f797eb1124f451aa8004a8f46a7a4465cd87c52e4255787c4c476"
      },
      "featured": true,
      "group": "room"
    },
    {
      "id": "Bowl",
      "name": [
        "依次送碗和勺子",
        "Bowl and spoon delivery"
      ],
      "robot": "Husky A200 + Kinova Gen3",
      "seconds": 87.86,
      "reward": 1.0,
      "episode": "58e5522df5184fc8",
      "revision": "7d8a12f6d8097bf859b092e8",
      "video": "./media/corpus/Bowl-episode.mp4",
      "poster": "./media/corpus/Bowl-poster.webp",
      "scoring": {
        "cycles": 4393,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            30.4,
            0.5,
            false
          ],
          [
            87.86,
            1.0,
            true
          ]
        ],
        "transitionsSha256": "e2643289b2940dfe2cb34b04da19b232be9114fd2fd2f9d0d71423c71dae824f"
      },
      "featured": true,
      "group": "room"
    },
    {
      "id": "Oil",
      "name": [
        "倒油并放回油壶",
        "Pouring and returning oil"
      ],
      "robot": null,
      "seconds": 79.4,
      "reward": 1.0,
      "episode": "42aed0fff5e54b86",
      "revision": "b1ce26147ecca50cb70ab5d3",
      "video": "./media/corpus/Oil-episode.mp4",
      "poster": "./media/corpus/Oil-poster.webp",
      "scoring": {
        "cycles": 3970,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            10.76,
            0.15,
            false
          ],
          [
            12.9,
            0.35,
            false
          ],
          [
            44.34,
            0.7,
            false
          ],
          [
            76.86,
            0.85,
            false
          ],
          [
            79.4,
            1.0,
            true
          ]
        ],
        "transitionsSha256": "5e3ef8f8cf3bd2766da9af674a743580113cd30ff0b0cd366ce65c9b9efd1ef3"
      },
      "featured": true,
      "group": "room"
    },
    {
      "id": "T02",
      "name": [
        "分类水果",
        "Sort fruit"
      ],
      "robot": "UR5 + WSG",
      "seconds": 223.3,
      "reward": 1.0,
      "episode": "0e77c68edb834bf4",
      "revision": "93abfd7b8c3b85a87f8b9c32",
      "video": "./media/appendix/T02.mp4",
      "poster": "./media/appendix/T02.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 4466,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            22.0,
            0.125,
            false
          ],
          [
            49.05,
            0.25,
            false
          ],
          [
            49.1,
            0.125,
            false
          ],
          [
            49.45,
            0.25,
            false
          ],
          [
            78.3,
            0.375,
            false
          ],
          [
            103.1,
            0.5,
            false
          ],
          [
            128.0,
            0.375,
            false
          ],
          [
            128.05,
            0.5,
            false
          ],
          [
            129.75,
            0.625,
            false
          ],
          [
            155.85,
            0.75,
            false
          ],
          [
            188.75,
            0.875,
            false
          ],
          [
            188.8,
            0.75,
            false
          ],
          [
            189.0,
            0.875,
            false
          ],
          [
            189.05,
            0.75,
            false
          ],
          [
            189.1,
            0.875,
            false
          ],
          [
            222.65,
            1.0,
            false
          ],
          [
            222.7,
            0.875,
            false
          ],
          [
            222.8,
            1.0,
            false
          ],
          [
            223.3,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T03",
      "name": [
        "布置餐桌",
        "Set the table"
      ],
      "robot": "Dual PiPER",
      "seconds": 325.533333,
      "reward": 1.0,
      "episode": "7b0032f0c7e54a7c",
      "revision": "5a0bbcba49156685c05f0e3d",
      "video": "./media/appendix/T03.mp4",
      "poster": "./media/appendix/T03.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 9766,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            73.366667,
            0.25,
            false
          ],
          [
            73.8,
            0.0,
            false
          ],
          [
            78.2,
            0.25,
            false
          ],
          [
            156.266667,
            0.5,
            false
          ],
          [
            236.8,
            0.75,
            false
          ],
          [
            305.733333,
            1.0,
            false
          ],
          [
            325.533333,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T04",
      "name": [
        "叠放碗",
        "Stack bowls"
      ],
      "robot": "ARX X5",
      "seconds": 65.083333,
      "reward": 1.0,
      "episode": "b5c4ad86d2e64db7",
      "revision": "eb4d38a430817684bfcc5421",
      "video": "./media/appendix/T04.mp4",
      "poster": "./media/appendix/T04.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 3905,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            62.183333,
            0.6,
            false
          ],
          [
            62.25,
            0.0,
            false
          ],
          [
            62.266667,
            0.6,
            false
          ],
          [
            65.083333,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T05",
      "name": [
        "排列积木",
        "Order blocks"
      ],
      "robot": "UR5 + WSG",
      "seconds": 114.2,
      "reward": 1.0,
      "episode": "f87d428b3e8b4558",
      "revision": "5621580906808a5627dee9b5",
      "video": "./media/appendix/T05.mp4",
      "poster": "./media/appendix/T05.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 2284,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            114.2,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T06",
      "name": [
        "挂杯子",
        "Hang a mug"
      ],
      "robot": "UR5 + WSG",
      "seconds": 75.866667,
      "reward": 1.0,
      "episode": "c76e518fc5cb43a4",
      "revision": "951c3830656eb4eb8e443010",
      "video": "./media/appendix/T06.mp4",
      "poster": "./media/appendix/T06.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 2276,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            13.4,
            0.25,
            false
          ],
          [
            75.866667,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T08",
      "name": [
        "双机器人协作取杯",
        "Two robots retrieve a cup"
      ],
      "robot": "Dual Fetch",
      "seconds": 106.7,
      "reward": 1.0,
      "episode": "cdb102a68f874dab",
      "revision": "978ef5382d9a40813ba94bbb",
      "video": "./media/appendix/T08.mp4",
      "poster": "./media/appendix/T08.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 2134,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            41.2,
            0.25,
            false
          ],
          [
            74.15,
            0.5,
            false
          ],
          [
            100.65,
            0.8,
            false
          ],
          [
            106.7,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T09",
      "name": [
        "关上容器",
        "Close a container"
      ],
      "robot": "Galaxea R1 Pro",
      "seconds": 50.1,
      "reward": 1.0,
      "episode": "efc5d84949f642d4",
      "revision": "afba4eafe76b3142748bc282",
      "video": "./media/appendix/T09.mp4",
      "poster": "./media/appendix/T09.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 1002,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            50.1,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T10",
      "name": [
        "扶正瓶子",
        "Stand a bottle upright"
      ],
      "robot": "Fetch",
      "seconds": 22.7,
      "reward": 1.0,
      "episode": "17a1cc83518a4a8e",
      "revision": "23e3016e76b3fc06d77e1814",
      "video": "./media/appendix/T10.mp4",
      "poster": "./media/appendix/T10.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 454,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            22.7,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T11",
      "name": [
        "从托盘转移物品",
        "Transfer objects from a tray"
      ],
      "robot": "UR5 + WSG",
      "seconds": 88.15,
      "reward": 1.0,
      "episode": "218368160c5a4aaa",
      "revision": "94a309e11465471f5bec926f",
      "video": "./media/appendix/T11.mp4",
      "poster": "./media/appendix/T11.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 1763,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            26.45,
            0.333333,
            false
          ],
          [
            58.75,
            0.666667,
            false
          ],
          [
            87.65,
            1.0,
            false
          ],
          [
            88.15,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T12",
      "name": [
        "倾倒木球",
        "Pour wooden balls"
      ],
      "robot": "ARX X5",
      "seconds": 42.75,
      "reward": 1.0,
      "episode": "7b313ce129984401",
      "revision": "4b790ab0c19b7513120fe83c",
      "video": "./media/appendix/T12.mp4",
      "poster": "./media/appendix/T12.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 855,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            18.6,
            0.15,
            false
          ],
          [
            18.65,
            0.3,
            false
          ],
          [
            18.75,
            0.45,
            false
          ],
          [
            18.9,
            0.6,
            false
          ],
          [
            42.75,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T13",
      "name": [
        "用夹钳移物",
        "Move objects with tongs"
      ],
      "robot": "PiPER",
      "seconds": 120.9,
      "reward": 1.0,
      "episode": "22ee54418a8447f6",
      "revision": "7b33ef3533f735971ef98568",
      "video": "./media/appendix/T13.mp4",
      "poster": "./media/appendix/T13.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 2418,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            36.7,
            0.25,
            false
          ],
          [
            64.35,
            0.0,
            false
          ],
          [
            64.8,
            0.5,
            false
          ],
          [
            92.45,
            0.0,
            false
          ],
          [
            92.95,
            0.75,
            false
          ],
          [
            120.9,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T14",
      "name": [
        "清扫碎屑",
        "Sweep debris"
      ],
      "robot": "Dual ARX X5",
      "seconds": 235.291667,
      "reward": 1.0,
      "episode": "e69f9881d19c4b38",
      "revision": "83b4415049e65837353ce171",
      "video": "./media/appendix/T14.mp4",
      "poster": "./media/appendix/T14.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 5647,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            93.25,
            0.25,
            false
          ],
          [
            93.416667,
            0.125,
            false
          ],
          [
            93.541667,
            0.0,
            false
          ],
          [
            94.583333,
            0.125,
            false
          ],
          [
            94.791667,
            0.0,
            false
          ],
          [
            95.458333,
            0.125,
            false
          ],
          [
            95.5,
            0.0,
            false
          ],
          [
            98.041667,
            0.125,
            false
          ],
          [
            98.541667,
            0.375,
            false
          ],
          [
            99.958333,
            0.25,
            false
          ],
          [
            135.125,
            0.125,
            false
          ],
          [
            135.416667,
            0.0,
            false
          ],
          [
            135.958333,
            0.125,
            false
          ],
          [
            136.041667,
            0.25,
            false
          ],
          [
            136.583333,
            0.0,
            false
          ],
          [
            137.083333,
            0.25,
            false
          ],
          [
            137.5,
            0.125,
            false
          ],
          [
            137.666667,
            0.0,
            false
          ],
          [
            138.0,
            0.125,
            false
          ],
          [
            138.041667,
            0.0,
            false
          ],
          [
            139.166667,
            0.125,
            false
          ],
          [
            139.625,
            0.25,
            false
          ],
          [
            139.708333,
            0.125,
            false
          ],
          [
            140.708333,
            0.25,
            false
          ],
          [
            155.958333,
            0.375,
            false
          ],
          [
            157.458333,
            0.25,
            false
          ],
          [
            157.958333,
            0.375,
            false
          ],
          [
            176.625,
            0.25,
            false
          ],
          [
            177.041667,
            0.125,
            false
          ],
          [
            177.333333,
            0.0,
            false
          ],
          [
            178.25,
            0.25,
            false
          ],
          [
            178.625,
            0.375,
            false
          ],
          [
            178.916667,
            0.5,
            false
          ],
          [
            179.583333,
            0.375,
            false
          ],
          [
            180.041667,
            0.0,
            false
          ],
          [
            180.166667,
            0.125,
            false
          ],
          [
            180.5,
            0.0,
            false
          ],
          [
            180.541667,
            0.125,
            false
          ],
          [
            180.583333,
            0.25,
            false
          ],
          [
            180.791667,
            0.0,
            false
          ],
          [
            181.0,
            0.125,
            false
          ],
          [
            181.291667,
            0.25,
            false
          ],
          [
            181.833333,
            0.375,
            false
          ],
          [
            181.958333,
            0.5,
            false
          ],
          [
            182.166667,
            0.375,
            false
          ],
          [
            182.5,
            0.25,
            false
          ],
          [
            182.708333,
            0.125,
            false
          ],
          [
            182.75,
            0.0,
            false
          ],
          [
            183.0,
            0.125,
            false
          ],
          [
            183.25,
            0.25,
            false
          ],
          [
            183.375,
            0.0,
            false
          ],
          [
            183.541667,
            0.125,
            false
          ],
          [
            183.875,
            0.375,
            false
          ],
          [
            184.083333,
            0.25,
            false
          ],
          [
            184.166667,
            0.125,
            false
          ],
          [
            185.125,
            0.25,
            false
          ],
          [
            186.208333,
            0.375,
            false
          ],
          [
            187.416667,
            0.125,
            false
          ],
          [
            187.5,
            0.0,
            false
          ],
          [
            188.166667,
            0.375,
            false
          ],
          [
            188.375,
            0.25,
            false
          ],
          [
            188.5,
            0.375,
            false
          ],
          [
            188.958333,
            0.0,
            false
          ],
          [
            189.5,
            0.125,
            false
          ],
          [
            189.583333,
            0.25,
            false
          ],
          [
            189.833333,
            0.375,
            false
          ],
          [
            190.125,
            0.5,
            false
          ],
          [
            190.25,
            0.0,
            false
          ],
          [
            192.041667,
            0.25,
            false
          ],
          [
            192.166667,
            0.125,
            false
          ],
          [
            192.208333,
            0.0,
            false
          ],
          [
            192.833333,
            0.5,
            false
          ],
          [
            193.0,
            0.625,
            false
          ],
          [
            195.375,
            0.25,
            false
          ],
          [
            195.875,
            0.625,
            false
          ],
          [
            196.041667,
            0.25,
            false
          ],
          [
            196.541667,
            0.5,
            false
          ],
          [
            196.583333,
            0.375,
            false
          ],
          [
            196.708333,
            0.0,
            false
          ],
          [
            197.208333,
            0.375,
            false
          ],
          [
            197.333333,
            0.5,
            false
          ],
          [
            209.125,
            0.625,
            false
          ],
          [
            213.166667,
            0.75,
            false
          ],
          [
            213.75,
            0.625,
            false
          ],
          [
            216.541667,
            0.75,
            false
          ],
          [
            216.708333,
            0.625,
            false
          ],
          [
            216.916667,
            0.375,
            false
          ],
          [
            217.041667,
            0.25,
            false
          ],
          [
            217.25,
            0.125,
            false
          ],
          [
            217.291667,
            0.25,
            false
          ],
          [
            217.5,
            0.375,
            false
          ],
          [
            217.666667,
            0.25,
            false
          ],
          [
            217.708333,
            0.0,
            false
          ],
          [
            217.791667,
            0.125,
            false
          ],
          [
            217.875,
            0.25,
            false
          ],
          [
            218.041667,
            0.125,
            false
          ],
          [
            218.25,
            0.375,
            false
          ],
          [
            218.291667,
            0.25,
            false
          ],
          [
            218.375,
            0.375,
            false
          ],
          [
            218.458333,
            0.25,
            false
          ],
          [
            218.541667,
            0.375,
            false
          ],
          [
            218.666667,
            0.25,
            false
          ],
          [
            219.125,
            0.375,
            false
          ],
          [
            219.208333,
            0.5,
            false
          ],
          [
            219.416667,
            0.625,
            false
          ],
          [
            219.666667,
            0.75,
            false
          ],
          [
            219.75,
            0.875,
            false
          ],
          [
            220.0,
            1.0,
            false
          ],
          [
            223.541667,
            0.875,
            false
          ],
          [
            223.625,
            0.625,
            false
          ],
          [
            224.25,
            0.5,
            false
          ],
          [
            224.75,
            0.625,
            false
          ],
          [
            226.291667,
            0.75,
            false
          ],
          [
            226.5,
            1.0,
            false
          ],
          [
            235.291667,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T17",
      "name": [
        "把笔放进笔筒",
        "Organize pens in a holder"
      ],
      "robot": "UR5 + WSG",
      "seconds": 245.8,
      "reward": 1.0,
      "episode": "trial-independent-prefix-originalscore",
      "revision": "150eccf19a7d9ec907cafdd5",
      "video": "./media/appendix/T17.mp4",
      "poster": "./media/appendix/T17.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 4917,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            75.5,
            0.25,
            false
          ],
          [
            128.65,
            0.5,
            false
          ],
          [
            189.15,
            0.75,
            false
          ],
          [
            243.2,
            1.0,
            false
          ],
          [
            245.8,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T18",
      "name": [
        "摆放手机",
        "Place a phone"
      ],
      "robot": "Unitree G1",
      "seconds": 35.166667,
      "reward": 1.0,
      "episode": "bfb194ae185b48ad",
      "revision": "f39fb4d4b41417368a446bf4",
      "video": "./media/appendix/T18.mp4",
      "poster": "./media/appendix/T18.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 1055,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            35.166667,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T19",
      "name": [
        "按下按钮",
        "Press a button"
      ],
      "robot": "UR5e",
      "seconds": 24.3,
      "reward": 1.0,
      "episode": "2a661036cff044d8",
      "revision": "dd50444ab5fe0c97cdc0095b",
      "video": "./media/appendix/T19.mp4",
      "poster": "./media/appendix/T19.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 729,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            22.333333,
            0.4,
            false
          ],
          [
            24.3,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T20",
      "name": [
        "搬运装载托盘",
        "Move a loaded tray"
      ],
      "robot": "Dual UR5",
      "seconds": 72.7,
      "reward": 1.0,
      "episode": "a8b434a4d7264392",
      "revision": "d9af6937161ed11947de9d2d",
      "video": "./media/appendix/T20.mp4",
      "poster": "./media/appendix/T20.webp",
      "featured": false,
      "group": "tabletop",
      "scoring": {
        "cycles": 1454,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            72.7,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T01-fetch",
      "name": [
        "Fetch 摆放苹果",
        "Fetch places the apple"
      ],
      "robot": "Fetch",
      "seconds": 21.9,
      "reward": 1.0,
      "episode": "c7b1c3e3362f408e",
      "revision": "131ded6bbc8143dd2c33516a",
      "video": "./media/appendix/T01-fetch.mp4",
      "poster": "./media/appendix/T01-fetch.webp",
      "featured": false,
      "group": "embodiment",
      "scoring": {
        "cycles": 438,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            13.45,
            0.2,
            false
          ],
          [
            21.9,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T01-arx-x5a",
      "name": [
        "ARX X5A 摆放苹果",
        "ARX X5A places the apple"
      ],
      "robot": "ARX X5A",
      "seconds": 19.05,
      "reward": 1.0,
      "episode": "431fefcb2f334696",
      "revision": "05fb7c5870bc9ed66374011e",
      "video": "./media/appendix/T01-arx-x5a.mp4",
      "poster": "./media/appendix/T01-arx-x5a.webp",
      "featured": false,
      "group": "embodiment",
      "scoring": {
        "cycles": 381,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            10.75,
            0.2,
            false
          ],
          [
            19.0,
            0.5,
            false
          ],
          [
            19.05,
            1.0,
            true
          ]
        ]
      }
    },
    {
      "id": "T01-yam",
      "name": [
        "I2RT YAM 摆放苹果",
        "I2RT YAM places the apple"
      ],
      "robot": "I2RT YAM",
      "seconds": 17.35,
      "reward": 1.0,
      "episode": "07c7b25ed45f4784",
      "revision": "7c63b148039d19862ebdfa28",
      "video": "./media/appendix/T01-yam.mp4",
      "poster": "./media/appendix/T01-yam.webp",
      "featured": false,
      "group": "embodiment",
      "scoring": {
        "cycles": 347,
        "events": [
          [
            0,
            0.0,
            false
          ],
          [
            10.65,
            0.2,
            false
          ],
          [
            17.35,
            1.0,
            true
          ]
        ]
      }
    }
  ],
  "figures": {
    "teaser": "./media/corpus/teaser.webp",
    "method": "./media/corpus/method.webp",
    "comparison": "./media/corpus/comparison.webp",
    "layout-variation": "./media/corpus/layout-variation.webp",
    "apple-policy": "./media/corpus/apple-policy.webp"
  },
  "learning": [
    {
      "id": "T04",
      "images": [
        "./media/corpus/T04-baseline.webp",
        "./media/corpus/T04-fit.webp"
      ]
    },
    {
      "id": "M09",
      "images": [
        "./media/corpus/M09-baseline.webp",
        "./media/corpus/M09-fit.webp"
      ]
    },
    {
      "id": "R09",
      "images": [
        "./media/corpus/R09-baseline.webp",
        "./media/corpus/R09-fit.webp"
      ]
    },
    {
      "id": "R12",
      "images": [
        "./media/corpus/R12-baseline.webp",
        "./media/corpus/R12-fit.webp"
      ]
    }
  ]
};
