const getENV = () => {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || url.length == 0) console.log("check ENV file (url)")
    if (!token || token.length == 0) console.log("check ENV file (token)")

    return { token, url }
}

type Command = 'zrange' | 'sismember' | 'get' | 'smembers';

export const fetchRedis = async (command: Command, ...args: (string | number)[]) => {
    const commUrl = `${getENV().url}/${command}/${args.join("/")}`;

    const res = await fetch(commUrl, {
        headers: {
            Authorization: `Bearer ${getENV().token}`
        }, cache: "no-store"
    });
    if (!res.ok) throw new Error(`redis error ${res.statusText}}`);

    const data = await res.json();

    return data.result;
}