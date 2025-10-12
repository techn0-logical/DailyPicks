const MLB_TEAMS = {
    // American League East
    "BOS": {
        "name": "Boston Red Sox",
        "city": "Boston",
        "division": "AL East",
        "colors": {
            "primary": "#BD3039",
            "secondary": "#0C2340"
        },
        "abbreviations": ["BOS", "BSN"]
    },
    "NYY": {
        "name": "New York Yankees",
        "city": "New York",
        "division": "AL East",
        "colors": {
            "primary": "#132448",
            "secondary": "#C4CED4"
        },
        "abbreviations": ["NYY", "NY"]
    },
    "TBR": {
        "name": "Tampa Bay Rays",
        "city": "Tampa Bay",
        "division": "AL East",
        "colors": {
            "primary": "#092C5C",
            "secondary": "#8FBCE6"
        },
        "abbreviations": ["TBR", "TB"]
    },
    "TOR": {
        "name": "Toronto Blue Jays",
        "city": "Toronto",
        "division": "AL East",
        "colors": {
            "primary": "#134A8E",
            "secondary": "#1D2D5C"
        },
        "abbreviations": ["TOR", "TOR"]
    },
    "BAL": {
        "name": "Baltimore Orioles",
        "city": "Baltimore",
        "division": "AL East",
        "colors": {
            "primary": "#DF4601",
            "secondary": "#000000"
        },
        "abbreviations": ["BAL", "BAL"]
    },
    
    // American League Central
    "CHW": {
        "name": "Chicago White Sox",
        "city": "Chicago",
        "division": "AL Central",
        "colors": {
            "primary": "#27251F",
            "secondary": "#C4CED4"
        },
        "abbreviations": ["CHW", "CWS"]
    },
    "CLE": {
        "name": "Cleveland Guardians",
        "city": "Cleveland",
        "division": "AL Central",
        "colors": {
            "primary": "#E31937",
            "secondary": "#002B5C"
        },
        "abbreviations": ["CLE", "CLE"]
    },
    "DET": {
        "name": "Detroit Tigers",
        "city": "Detroit",
        "division": "AL Central",
        "colors": {
            "primary": "#0C2340",
            "secondary": "#FA4616"
        },
        "logo": "https://www.mlbstatic.com/team-logos/116.svg",
        "abbreviations": ["DET", "DET"]
    },
    "KCR": {
        "name": "Kansas City Royals",
        "city": "Kansas City",
        "division": "AL Central",
        "colors": {
            "primary": "#004687",
            "secondary": "#BD9B60"
        },
        "abbreviations": ["KCR", "KC"]
    },
    "MIN": {
        "name": "Minnesota Twins",
        "city": "Minneapolis",
        "division": "AL Central",
        "colors": {
            "primary": "#002B5C",
            "secondary": "#D31145"
        },
        "abbreviations": ["MIN", "MIN"]
    },
    
    // American League West
    "HOU": {
        "name": "Houston Astros",
        "city": "Houston",
        "division": "AL West",
        "colors": {
            "primary": "#002D62",
            "secondary": "#EB6E1F"
        },
        "abbreviations": ["HOU", "HOU"]
    },
    "LAA": {
        "name": "Los Angeles Angels",
        "city": "Los Angeles",
        "division": "AL West",
        "colors": {
            "primary": "#BA0021",
            "secondary": "#003263"
        },
        "abbreviations": ["LAA", "ANA"]
    },
    "OAK": {
        "name": "Oakland Athletics",
        "city": "Oakland",
        "division": "AL West",
        "colors": {
            "primary": "#003831",
            "secondary": "#EFB21E"
        },
        "abbreviations": ["OAK", "OAK"]
    },
    "SEA": {
        "name": "Seattle Mariners",
        "city": "Seattle",
        "division": "AL West",
        "colors": {
            "primary": "#0C2C56",
            "secondary": "#005C5C"
        },
        "logo": "https://www.mlbstatic.com/team-logos/136.svg",
        "abbreviations": ["SEA", "SEA"]
    },
    "TEX": {
        "name": "Texas Rangers",
        "city": "Arlington",
        "division": "AL West",
        "colors": {
            "primary": "#003278",
            "secondary": "#C0111F"
        },
        "abbreviations": ["TEX", "TEX"]
    },
    
    // National League East
    "ATL": {
        "name": "Atlanta Braves",
        "city": "Atlanta",
        "division": "NL East",
        "colors": {
            "primary": "#CE1141",
            "secondary": "#13274F"
        },
        "abbreviations": ["ATL", "ATL"]
    },
    "MIA": {
        "name": "Miami Marlins",
        "city": "Miami",
        "division": "NL East",
        "colors": {
            "primary": "#00A3E0",
            "secondary": "#EF3340"
        },
        "abbreviations": ["MIA", "FLA"]
    },
    "NYM": {
        "name": "New York Mets",
        "city": "New York",
        "division": "NL East",
        "colors": {
            "primary": "#002D72",
            "secondary": "#FF5910"
        },
        "abbreviations": ["NYM", "NYM"]
    },
    "PHI": {
        "name": "Philadelphia Phillies",
        "city": "Philadelphia",
        "division": "NL East",
        "colors": {
            "primary": "#E81828",
            "secondary": "#002D72"
        },
        "abbreviations": ["PHI", "PHI"]
    },
    "WSN": {
        "name": "Washington Nationals",
        "city": "Washington",
        "division": "NL East",
        "colors": {
            "primary": "#AB0003",
            "secondary": "#14225A"
        },
        "abbreviations": ["WSN", "WAS"]
    },
    
    // National League Central
    "CHC": {
        "name": "Chicago Cubs",
        "city": "Chicago",
        "division": "NL Central",
        "colors": {
            "primary": "#0E3386",
            "secondary": "#CC3433"
        },
        "logo": "https://www.mlbstatic.com/team-logos/112.svg",
        "abbreviations": ["CHC", "CHI"]
    },
    "CIN": {
        "name": "Cincinnati Reds",
        "city": "Cincinnati",
        "division": "NL Central",
        "colors": {
            "primary": "#C6011F",
            "secondary": "#000000"
        },
        "abbreviations": ["CIN", "CIN"]
    },
    "MIL": {
        "name": "Milwaukee Brewers",
        "city": "Milwaukee",
        "division": "NL Central",
        "colors": {
            "primary": "#0A2351",
            "secondary": "#B6922E"
        },
        "logo": "https://www.mlbstatic.com/team-logos/158.svg",
        "abbreviations": ["MIL", "MIL"]
    },
    "PIT": {
        "name": "Pittsburgh Pirates",
        "city": "Pittsburgh",
        "division": "NL Central",
        "colors": {
            "primary": "#FDB827",
            "secondary": "#27251F"
        },
        "abbreviations": ["PIT", "PIT"]
    },
    "STL": {
        "name": "St. Louis Cardinals",
        "city": "St. Louis",
        "division": "NL Central",
        "colors": {
            "primary": "#C41E3A",
            "secondary": "#000066"
        },
        "abbreviations": ["STL", "STL"]
    },
    
    // National League West
    "ARI": {
        "name": "Arizona Diamondbacks",
        "city": "Phoenix",
        "division": "NL West",
        "colors": {
            "primary": "#A71930",
            "secondary": "#E3D4A1"
        },
        "abbreviations": ["ARI", "AZ"]
    },
    "COL": {
        "name": "Colorado Rockies",
        "city": "Denver",
        "division": "NL West",
        "colors": {
            "primary": "#33006F",
            "secondary": "#C4CED4"
        },
        "abbreviations": ["COL", "COL"]
    },
    "LAD": {
        "name": "Los Angeles Dodgers",
        "city": "Los Angeles",
        "division": "NL West",
        "colors": {
            "primary": "#005A9C",
            "secondary": "#EF3E42"
        },
        "abbreviations": ["LAD", "LA"]
    },
    "SDP": {
        "name": "San Diego Padres",
        "city": "San Diego",
        "division": "NL West",
        "colors": {
            "primary": "#2F241D",
            "secondary": "#FFC425"
        },
        "abbreviations": ["SDP", "SD"]
    },
    "SFG": {
        "name": "San Francisco Giants",
        "city": "San Francisco",
        "division": "NL West",
        "colors": {
            "primary": "#FD5A1E",
            "secondary": "#27251F"
        },
        "abbreviations": ["SFG", "SF"]
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MLB_TEAMS;
}