import { GRAPHQL_PLAYGROUND_GET, GRAPHQL_POST } from '@payloadcms/next/routes';
import config from '@/payload.config';

export const GET = GRAPHQL_PLAYGROUND_GET(config);
export const POST = GRAPHQL_POST(config);
export const OPTIONS = GRAPHQL_POST(config); // GraphQL usually uses POST for OPTIONS check or similar, but Payload often handles this in POST/GET. Setting POST as fallback.
