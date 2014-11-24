{
    "targets": [
        {
            "target_name": "fs-ext", 
            "include_dirs" : [ "<!(node -e \"require('nan')\")" ],
            "sources": [
                "fs-ext.cc"
            ]
        }
    ]
}
