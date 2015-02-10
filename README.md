# Monacle #

The goal of this project is to build reading and searching tools for the scientific literature based around open-access, online content. We have integrated [eLife Lens](https://github.com/elifesciences/lens "eLife Lens") with the open-access portion of the [PubMed Central database](http://www.ncbi.nlm.nih.gov/pmc/), and have built a search interface wrapped around PubMed itself. 

This project uses parts of [http://github.com/ivangrub/oa-sandbox](OA-Sandbox) but is built using a Node framework on the backend. It also uses a custom build of the [http://github.com/caydenberg/lens-starter](Lens starter kit). For now, I've installed that project in a parallel directory to the Monacle directory and build my lens.js file by running the shell script `lens.sh`.

## Roadmap ##

1. Clean-up code and streamline
1. User accounts
1. Saved articles
1. Custom searches
1. Notes on articles (using Lens panels)
1. API (serving Lens JSON on backend)
1. Annotation
