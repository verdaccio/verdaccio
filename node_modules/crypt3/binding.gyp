{
  "targets": [
    {
      "target_name": "crypt3",
      "sources": [ "crypt3.cc" ],
      "include_dirs" : [ "<!(node -e \"require('nan')\")" ],
      "conditions": [
        ['OS!="mac"', {
          'link_settings': { "libraries": [ "-lcrypt" ] }
        }]
      ]
    }
  ]
}
