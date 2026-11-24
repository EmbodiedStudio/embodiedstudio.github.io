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
      }
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
      "poster": "./media/corpus/T07-poster.webp"
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
      }
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
      }
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
      }
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
      }
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
      }
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
  ],
  "appendixVideos": [
    {
      "id": "T02",
      "name": [
        "分类水果",
        "Sort fruit"
      ],
      "seconds": 223.4,
      "video": "./media/appendix/T02.mp4",
      "poster": "./media/appendix/T02.webp"
    },
    {
      "id": "T03",
      "name": [
        "布置餐桌",
        "Set the table"
      ],
      "seconds": 325.6,
      "video": "./media/appendix/T03.mp4",
      "poster": "./media/appendix/T03.webp"
    },
    {
      "id": "T04",
      "name": [
        "叠放碗",
        "Stack bowls"
      ],
      "seconds": 65.1,
      "video": "./media/appendix/T04.mp4",
      "poster": "./media/appendix/T04.webp"
    },
    {
      "id": "T05",
      "name": [
        "排列积木",
        "Order blocks"
      ],
      "seconds": 114.4,
      "video": "./media/appendix/T05.mp4",
      "poster": "./media/appendix/T05.webp"
    },
    {
      "id": "T06",
      "name": [
        "挂杯子",
        "Hang a mug"
      ],
      "seconds": 76.0,
      "video": "./media/appendix/T06.mp4",
      "poster": "./media/appendix/T06.webp"
    },
    {
      "id": "T08",
      "name": [
        "双机器人协作取杯",
        "Two robots retrieve a cup"
      ],
      "seconds": 106.8,
      "video": "./media/appendix/T08.mp4",
      "poster": "./media/appendix/T08.webp"
    },
    {
      "id": "T09",
      "name": [
        "关上容器",
        "Close a container"
      ],
      "seconds": 50.2,
      "video": "./media/appendix/T09.mp4",
      "poster": "./media/appendix/T09.webp"
    },
    {
      "id": "T10",
      "name": [
        "扶正瓶子",
        "Stand a bottle upright"
      ],
      "seconds": 22.8,
      "video": "./media/appendix/T10.mp4",
      "poster": "./media/appendix/T10.webp"
    },
    {
      "id": "T11",
      "name": [
        "从托盘转移物品",
        "Transfer objects from a tray"
      ],
      "seconds": 88.2,
      "video": "./media/appendix/T11.mp4",
      "poster": "./media/appendix/T11.webp"
    },
    {
      "id": "T12",
      "name": [
        "倾倒木球",
        "Pour wooden balls"
      ],
      "seconds": 42.8,
      "video": "./media/appendix/T12.mp4",
      "poster": "./media/appendix/T12.webp"
    },
    {
      "id": "T13",
      "name": [
        "用夹钳移物",
        "Move objects with tongs"
      ],
      "seconds": 121.0,
      "video": "./media/appendix/T13.mp4",
      "poster": "./media/appendix/T13.webp"
    },
    {
      "id": "T14",
      "name": [
        "清扫碎屑",
        "Sweep debris"
      ],
      "seconds": 235.375,
      "video": "./media/appendix/T14.mp4",
      "poster": "./media/appendix/T14.webp"
    },
    {
      "id": "T17",
      "name": [
        "把笔放进笔筒",
        "Organize pens in a holder"
      ],
      "seconds": 245.9,
      "video": "./media/appendix/T17.mp4",
      "poster": "./media/appendix/T17.webp"
    },
    {
      "id": "T18",
      "name": [
        "摆放手机",
        "Place a phone"
      ],
      "seconds": 35.2,
      "video": "./media/appendix/T18.mp4",
      "poster": "./media/appendix/T18.webp"
    },
    {
      "id": "T19",
      "name": [
        "按下按钮",
        "Press a button"
      ],
      "seconds": 24.4,
      "video": "./media/appendix/T19.mp4",
      "poster": "./media/appendix/T19.webp"
    },
    {
      "id": "T20",
      "name": [
        "搬运装载托盘",
        "Move a loaded tray"
      ],
      "seconds": 72.8,
      "video": "./media/appendix/T20.mp4",
      "poster": "./media/appendix/T20.webp"
    },
    {
      "id": "T01-fetch",
      "name": [
        "Fetch 摆放苹果",
        "Fetch places the apple"
      ],
      "seconds": 22.0,
      "video": "./media/appendix/T01-fetch.mp4",
      "poster": "./media/appendix/T01-fetch.webp"
    },
    {
      "id": "T01-arx-x5a",
      "name": [
        "ARX X5A 摆放苹果",
        "ARX X5A places the apple"
      ],
      "seconds": 19.1,
      "video": "./media/appendix/T01-arx-x5a.mp4",
      "poster": "./media/appendix/T01-arx-x5a.webp"
    },
    {
      "id": "T01-yam",
      "name": [
        "I2RT YAM 摆放苹果",
        "I2RT YAM places the apple"
      ],
      "seconds": 17.4,
      "video": "./media/appendix/T01-yam.mp4",
      "poster": "./media/appendix/T01-yam.webp"
    }
  ]
};
