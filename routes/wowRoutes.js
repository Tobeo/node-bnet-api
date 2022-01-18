const axios = require('axios');
const express = require('express');
const router = express.Router();
const ensureAuth = require('../auth/ensureAuth')

const LOCALE = process.env.LOCALE || 'en_GB';
const REGION = process.env.REGION || 'eu';
const PROFILE_NAMESPACE = process.env.PROFILE_NAMESPACE || 'profile-eu';
const STATIC_NAMESPACE = process.env.STATIC_NAMESPACE || 'static-eu';

router.get('/getProfileSummary',
    ensureAuth,
    (req, res) => {
        axios.get(`https://${REGION}.api.blizzard.com/profile/user/wow`, {
            headers: {
                'Authorization': 'Bearer ' + req.user.token,
                'Battlenet-Namespace': PROFILE_NAMESPACE
            },
            region: REGION,
            locale: LOCALE
        })
            .then(response => {
                res.send(response.data)
            })
    })


router.get('/getCollectionsSummary',
    ensureAuth,
    (req, res) => {
        axios.get(`https://${REGION}.api.blizzard.com/profile/user/wow/collections/mounts`, {
            headers: {
                'Authorization': 'Bearer ' + req.user.token,
                'Battlenet-Namespace': PROFILE_NAMESPACE
            },
            region: REGION,
            locale: LOCALE
        })
            .then(response => {
                res.send(response.data);
            })
    })

//This dude is pretty slow
router.get('/getReputations',
    ensureAuth,
    async (req, res) => {
        await axios.get(`https://${REGION}.api.blizzard.com/profile/user/wow`, {
            headers: {
                'Authorization': 'Bearer ' + req.user.token,
                'Battlenet-Namespace': PROFILE_NAMESPACE
            },
            region: REGION,
            locale: LOCALE
        })
            .then(response => {
                const characters = []
                response.data.wow_accounts.map(account =>
                    account.characters.map(character => {
                        //omit lowbies, still slow...
                        if (character.level >= 50) {
                            //pushes 'server-slug/charactername' to the array
                            characters.push(`${character.realm.slug}/${character.name.toLowerCase()}`)
                        }
                    })
                );
                const promises = [];
                const reputations = [];
                characters.forEach(async realmSlugCharName => {
                    promises.push(axios.get(`https://${REGION}.api.blizzard.com/profile/wow/character/${realmSlugCharName}/reputations`, {
                        headers: {
                            'Authorization': 'Bearer ' + req.user.token,
                            'Battlenet-Namespace': PROFILE_NAMESPACE
                        },
                        region: REGION,
                        locale: LOCALE
                    }))


                })
                Promise.all(promises)
                    .then(response => {
                        response.forEach(item => {
                        reputations.push({
                            CharacterName: item.data.character.name,
                            characterId: item.data.character.id,
                            reputations: item.data.reputations
                        });
                    })
                })
                    .then(_ => {
                        res.send(reputations)
                    }

            )


    })
})

router.get('/getAllFactions',
    ensureAuth,
    async (req, res) => {
    axios.get(`https://${REGION}.api.blizzard.com/data/wow/reputation-faction/index`, {
        headers: {
            'Authorization': 'Bearer ' + req.user.token,
            'Battlenet-Namespace': STATIC_NAMESPACE
        },
        region: REGION,
        locale: LOCALE
    })
        .then(response => {
            res.send(response.data)
        }
    )
})

module.exports = router;